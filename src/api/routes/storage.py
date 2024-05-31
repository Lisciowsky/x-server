from boto3 import client, Session
from fastapi import Depends, APIRouter, HTTPException, status
from src.token.token_maker import get_current_user, UserPayload
from pydantic import BaseModel
from loguru import logger

from src.utils.s3_storage import list_files_folders

from settings import STORAGE_BUCKET_NAME, BUCKET_REGION_NAME, LOCAL_DEVELOPMENT

storage_router = APIRouter(prefix="/storage")


if LOCAL_DEVELOPMENT:
    session = Session(profile_name="private")
    s3_client = session.client("s3", region_name=BUCKET_REGION_NAME)
else:
    s3_client = client("s3", region_name=BUCKET_REGION_NAME)


class GetUserStorageResponse(BaseModel):
    folders: dict


class GetPresignedUrlResponse(BaseModel):
    url: str


@storage_router.get("/{username}", response_model=GetUserStorageResponse)
async def get_user_storage(
    username: str, current_user: UserPayload = Depends(get_current_user)
):
    if username != current_user.username:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this storage"
        )

    prefix = f"{username}/"
    try:
        user_storage_structure = list_files_folders(
            s3_client=s3_client, bucket_name=STORAGE_BUCKET_NAME, prefix=prefix
        )
    except Exception as ex:
        ex_msg = f"failed to load the user: {username} storage"
        logger.exception(ex_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ex_msg,
        )
    return GetUserStorageResponse(folders=user_storage_structure)


@storage_router.get(
    "/upload-url/{username}/{file_path:path}", response_model=GetPresignedUrlResponse
)
async def get_upload_url(
    username: str, file_path: str, current_user: UserPayload = Depends(get_current_user)
):
    if username != current_user.username:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to generate upload URL for this user",
        )

    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={"Bucket": STORAGE_BUCKET_NAME, "Key": f"{username}/{file_path}"},
            ExpiresIn=3600,
        )
        return GetPresignedUrlResponse(url=presigned_url)
    except Exception as e:
        logger.exception("Failed to generate presigned URL for upload")
        raise HTTPException(status_code=500, detail="Failed to generate upload URL")


@storage_router.get(
    "/download-url/{username}/{file_path:path}", response_model=GetPresignedUrlResponse
)
async def get_download_url(
    username: str, file_path: str, current_user: UserPayload = Depends(get_current_user)
):
    if username != current_user.username:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this file"
        )

    try:
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": STORAGE_BUCKET_NAME, "Key": f"{username}/{file_path}"},
            ExpiresIn=3600,
        )  # URL expires in 1 hour
        return GetPresignedUrlResponse(url=presigned_url)
    except Exception as e:
        logger.exception("Failed to generate presigned URL for download")
        raise HTTPException(status_code=500, detail="Failed to generate download URL")


@storage_router.delete("/delete/{username}/{file_path:path}")
async def delete_storage_item(
    username: str, file_path: str, current_user: UserPayload = Depends(get_current_user)
):
    """
    Deletes a file or folder from S3 storage for a given user. This method checks if the path is a folder
    by attempting to list objects under the given path. If objects exist, it treats the path as a folder.
    Otherwise, it assumes a file and attempts a direct deletion.
    """
    if username != current_user.username:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this storage item"
        )

    try:
        response = s3_client.list_objects_v2(
            Bucket=STORAGE_BUCKET_NAME, Prefix=f"{username}/{file_path}"
        )
        contents = response.get("Contents", [])

        if contents:
            if len(contents) == 1 and contents[0]["Key"] == f"{username}/{file_path}":
                s3_client.delete_object(
                    Bucket=STORAGE_BUCKET_NAME, Key=f"{username}/{file_path}"
                )
            else:
                delete_keys = [{"Key": obj["Key"]} for obj in contents]
                s3_client.delete_objects(
                    Bucket=STORAGE_BUCKET_NAME, Delete={"Objects": delete_keys}
                )
        else:
            s3_client.delete_object(
                Bucket=STORAGE_BUCKET_NAME, Key=f"{username}/{file_path}"
            )

        return {"detail": "Storage item deleted successfully"}
    except Exception as e:
        logger.exception("Failed to delete storage item")
        raise HTTPException(status_code=500, detail="Failed to delete storage item")
