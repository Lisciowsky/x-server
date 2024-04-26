from datetime import datetime
from boto3 import client, Session
from fastapi import Depends, APIRouter, HTTPException, status
from loguru import logger
from pydantic import BaseModel

from src.token.token_maker import get_current_user, UserPayload
from src.db.models import Media, MediaPermission
from src.db.dal import DAL

from settings import MEDIA_CONVERT_BUCKET_NAME, BUCKET_REGION_NAME

media_router = APIRouter(prefix="/media")

# session = Session(profile_name="private")

# s3_client = session.client("s3", region_name=BUCKET_REGION_NAME)
s3_client = client("s3", region_name=BUCKET_REGION_NAME)  # for deployment


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
        media: Media = await DAL().get_media(
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
    exists, size_in_mb = _get_s3_object_info(media_path)
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


class GetMediaResponse(BaseModel): ...


@media_router.get("/{media_path}", response_model=GetMediaResponse)
async def get_media(
    username: str, current_user: UserPayload = Depends(get_current_user)
): ...
