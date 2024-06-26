import json
from typing import List
from datetime import datetime, timedelta
from urllib.parse import quote_plus

from botocore.exceptions import ClientError
from botocore.signers import CloudFrontSigner

from loguru import logger
from pydantic import BaseModel, Field
from fastapi import Depends, APIRouter, HTTPException, status

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.backends import default_backend

from src.token.token_maker import get_current_user, UserPayload
from src.db.models import Media
from src.db.dal import DAL
from src.db.enums import PermissionTypes
from settings import (
    MEDIA_CONVERT_BUCKET_NAME,
    MEDIA_CLOUDFRONT_DOMAIN,
    MEDIA_PRIVATE_KEY_CDN_SECRET_NAME,
    MEDIA_PUBLIC_KEY_CDN_SECRET_NAME,
    BOTO3_SESSION,
)

s3_client = BOTO3_SESSION.client("s3")
secrets_client = BOTO3_SESSION.client("secretsmanager")
media_router = APIRouter(prefix="/media")


def _get_media_path(username: str, media_name: str) -> str:
    UPLOADS_S3_MEDIA_PREFIX = "uploads"
    return f"{UPLOADS_S3_MEDIA_PREFIX}/{username}/{media_name}"


def _get_s3_object_info(key: str) -> tuple:
    """
    Gets information about an S3 object.

    Args:
        key (str): The key of the object in the S3 bucket.

    Returns:
        tuple: (exists (bool), size_in_mb (float))
    """
    try:
        response = s3_client.head_object(Bucket=MEDIA_CONVERT_BUCKET_NAME, Key=key)
        size_bytes = response["ContentLength"]
        size_in_mb = size_bytes / (1024 * 1024)  # Convert bytes to megabytes
        return True, size_in_mb
    except s3_client.exceptions.ClientError as e:
        if int(e.response["Error"]["Code"]) == 404:
            return False, 0.0
        else:
            raise


def _get_secret(secret_name: str):
    response = secrets_client.get_secret_value(SecretId=secret_name)
    if "SecretString" in response:
        secret = json.loads(response["SecretString"])
        return secret.get("key")
    else:
        return None


def get_secret(secret_name: str):
    try:
        secret = _get_secret(secret_name=secret_name)
    except Exception as ex:
        ex_msg = f"Getting secret for secret_name: {secret_name} failed with: {ex}"
        logger.warning(ex_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return secret


def create_signed_url(
    url: str, private_key_pem: str, key_pair_id: str, expiration: datetime
):
    def rsa_signer(message):
        private_key = load_pem_private_key(
            private_key_pem.encode(), password=None, backend=default_backend()
        )
        return private_key.sign(message, padding.PKCS1v15(), hashes.SHA1())

    signer = CloudFrontSigner(key_pair_id, rsa_signer)

    try:
        presigned_url = signer.generate_presigned_url(url, date_less_than=expiration)
    except Exception as ex:
        logger.warning(f"Failed to generate presigned url with ex: {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Signed url creation error",
        )

    return presigned_url


class PresignedUrlResponse(BaseModel):
    url: str


@media_router.get("/upload-url/{media_name}", response_model=PresignedUrlResponse)
async def get_presigned_upload(
    media_name: str, current_user: UserPayload = Depends(get_current_user)
):
    media_path = _get_media_path(username=current_user.username, media_name=media_name)

    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": MEDIA_CONVERT_BUCKET_NAME,
                "Key": media_path,
            },
            ExpiresIn=3600,
        )
    except Exception as ex:
        ex_msg = f"generating presigned url failed with: {ex}"
        logger.warning(ex_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ex_msg
        )

    return PresignedUrlResponse(url=presigned_url)


class RegisterMediaResponse(BaseModel):
    media_id: int
    created_at: str
    size_in_mb: float


@media_router.get("/register_media/{media_name}", response_model=RegisterMediaResponse)
async def register_media(
    media_name: str, current_user: UserPayload = Depends(get_current_user)
):
    try:
        media = await DAL().get_media(
            media_name=media_name, owner_username=current_user.username
        )
    except Exception as ex:
        ex_msg = f"Failed to get media for: {media_name}"
        logger.warning(ex_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ex_msg,
        )

    if media is not None:
        if media.media_name == media_name:
            ex_msg = f"The media with media_name: {media_name} already exists in the media registry"
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=ex_msg,
            )

    media_path = _get_media_path(username=current_user.username, media_name=media_name)
    try:
        exists, size_in_mb = _get_s3_object_info(media_path)
    except ClientError as ex:
        logger.warning(
            f"Unable to get object info for media_path: {media_path}, ex: {ex}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media file not found in the upload directory",
        )

    media = Media(
        media_owner=current_user.username, media_name=media_name, size_in_mb=size_in_mb
    )

    try:
        created_media = await DAL().create_media(new_media=media)
    except Exception as ex:
        ex_msg = f"Creating media failed with: {ex}"
        logger.warning(ex_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ex_msg
        )

    return RegisterMediaResponse(
        media_id=created_media.id,
        created_at=created_media.created_at.isoformat(),
        size_in_mb=str(round(created_media.size_in_mb, 2)),
    )


class GetMediaAccessResponse(BaseModel):
    signed_url: str


@media_router.get("/access/{media_id}")
async def get_media_signed_url(
    media_id: int, current_user: UserPayload = Depends(get_current_user)
):
    try:
        media_permission = await DAL().get_permission_for_user(
            media_id=media_id, username=current_user.username
        )
    except Exception as ex:
        ex_msg = f"Getting media_permission for user failed with: {ex}"
        logger.warning(ex_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Getting media_permission for media_id: {media_id} failed",
        )
    if (
        not media_permission
        or media_permission.permission_type not in PermissionTypes.__members__
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access Denied"
        )

    try:
        media = await DAL().get_media_by_id(media_id=media_id)
    except Exception as ex:
        ex_msg = f"Getting media for media_id: {media_id} failed with ex: {ex}"
        logger.warning(ex_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Getting media with media_id: {media_id} failed",
        )
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Media not found"
        )

    url = f"https://{MEDIA_CLOUDFRONT_DOMAIN}/output/{media.media_owner}/{quote_plus(media.media_name)}"
    expiration = datetime.utcnow() + timedelta(hours=1)

    private_key = get_secret(secret_name=MEDIA_PRIVATE_KEY_CDN_SECRET_NAME)
    key_pair_id = get_secret(secret_name=MEDIA_PUBLIC_KEY_CDN_SECRET_NAME)

    try:
        signed_url = create_signed_url(
            url=url,
            private_key_pem=private_key,
            key_pair_id=key_pair_id,
            expiration=expiration,
        )
    except Exception as ex:
        logger.warning(ex)

    response = GetMediaAccessResponse(signed_url=signed_url)

    return response


class PaginatedMediaResponse(BaseModel):
    page: int = Field(..., example=100)
    page_size: int = Field(..., example=100)
    total_media: int = Field(..., example=100)
    media: List[Media]


@media_router.get("/all_media/", response_model=PaginatedMediaResponse)
async def get_all_media(
    page: int = 1,
    page_size: int = 10,
    current_user: UserPayload = Depends(get_current_user),
):
    all_media, total_media, page, page_size = await DAL().get_all_media(
        page=page,
        page_size=page_size,
        media_permission=True,
        username=current_user.username,
    )

    return {
        "page": page,
        "page_size": page_size,
        "total_media": total_media,
        "media": [media.model_dump() for media in all_media],
    }


@media_router.delete("/{media_id}/{media_name}")
async def delete_media_item(
    media_name: str,
    media_id: int,
    current_user: UserPayload = Depends(get_current_user),
):
    """
    Deletes a file from S3 storage for a given user. The file is specified by its name.
    This function assumes no nested directories are used in the bucket structure.
    """

    await DAL().delete_media_permissions_by_media_id(media_id=media_id)

    await DAL().delete_media_by_id(
        media_id=media_id,
    )

    file_key = f"{current_user.username}/{media_name}"
    try:
        s3_client.delete_object(
            Bucket=MEDIA_CONVERT_BUCKET_NAME, Key=f"output/{file_key}"
        )
        s3_client.delete_object(
            Bucket=MEDIA_CONVERT_BUCKET_NAME, Key=f"uploads/{file_key}"
        )
        return {"detail": "Storage item deleted successfully"}
    except Exception as e:
        logger.exception(f"Failed to delete storage item: {file_key}")
        raise HTTPException(status_code=500, detail="Failed to delete storage item")


class PaginatedUserMediaResponse(BaseModel):
    page: int = Field(..., example=100)
    page_size: int = Field(..., example=100)
    total_media: int = Field(..., example=100)
    media: List[Media]


@media_router.get("/user_media", response_model=PaginatedUserMediaResponse)
async def get_user_media(
    page: int = 1,
    page_size: int = 10,
    current_user: UserPayload = Depends(get_current_user),
):
    all_media, total_media, page, page_size = await DAL().get_all_media(
        page=page, page_size=page_size, username=current_user.username, media_owner=True
    )

    return {
        "page": page,
        "page_size": page_size,
        "total_media": total_media,
        "media": [media.model_dump() for media in all_media],
    }
