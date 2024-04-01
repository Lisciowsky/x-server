import boto3
from boto3.session import Session
from fastapi import Depends, APIRouter, HTTPException
from src.token.token_maker import get_current_user, UserPayload
from pydantic import BaseModel
from loguru import logger

from settings import BUCKET_NAME, BUCKET_REGION_NAME

storage_router = APIRouter(prefix="/storage")

# session = Session(profile_name="private")

# s3_client = session.client("s3", region_name="eu-central-1")
s3_client = boto3.client("s3", region_name=BUCKET_REGION_NAME)  # for deployment


class GetUserStorageResponse(BaseModel):
    folders: dict


def list_files_folders(prefix=""):
    """
    Recursively list files and folders under a given prefix.
    """
    response = s3_client.list_objects_v2(
        Bucket=BUCKET_NAME, Prefix=prefix, Delimiter="/"
    )
    files = [
        obj["Key"][len(prefix) :]
        for obj in response.get("Contents", [])
        if "Key" in obj and obj["Key"] != prefix
    ]
    folders = {prefix: files}

    for common_prefix in response.get("CommonPrefixes", []):
        sub_prefix = common_prefix.get("Prefix")
        sub_folders = list_files_folders(sub_prefix)
        folders.update(sub_folders)

    return folders


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
        user_storage_structure = list_files_folders(prefix=prefix)
    except Exception as ex:
        logger.exception(f"failed to load the user: {username} storage")
    return GetUserStorageResponse(folders=user_storage_structure)


@storage_router.get("/upload-url/{username}/{file_path:path}")
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
            Params={"Bucket": BUCKET_NAME, "Key": f"{username}/{file_path}"},
            ExpiresIn=3600,
        )
        return {"url": presigned_url}
    except Exception as e:
        logger.exception("Failed to generate presigned URL for upload")
        raise HTTPException(status_code=500, detail="Failed to generate upload URL")


@storage_router.get("/download-url/{username}/{file_path:path}")
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
            Params={"Bucket": BUCKET_NAME, "Key": f"{username}/{file_path}"},
            ExpiresIn=3600,
        )  # URL expires in 1 hour
        return {"url": presigned_url}
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
        # Check if the path has contents (assuming it might be a folder)
        response = s3_client.list_objects_v2(
            Bucket=BUCKET_NAME, Prefix=f"{username}/{file_path}"
        )
        contents = response.get("Contents", [])

        if contents:
            # If the first key equals the prefix, it's a single file; otherwise, treat as a folder
            if len(contents) == 1 and contents[0]["Key"] == f"{username}/{file_path}":
                s3_client.delete_object(
                    Bucket=BUCKET_NAME, Key=f"{username}/{file_path}"
                )
            else:
                # Treat as a folder (delete all objects under the prefix)
                delete_keys = [{"Key": obj["Key"]} for obj in contents]
                s3_client.delete_objects(
                    Bucket=BUCKET_NAME, Delete={"Objects": delete_keys}
                )
        else:
            # Attempt to delete assuming it's a file (or an empty folder)
            s3_client.delete_object(Bucket=BUCKET_NAME, Key=f"{username}/{file_path}")

        return {"detail": "Storage item deleted successfully"}
    except Exception as e:
        logger.exception("Failed to delete storage item")
        raise HTTPException(status_code=500, detail="Failed to delete storage item")
