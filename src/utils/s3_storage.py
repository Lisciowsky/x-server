from boto3 import client


def list_files_folders(s3_client: client, bucket_name: str, prefix=""):
    """
    Recursively list files and folders under a given prefix.
    """
    response = s3_client.list_objects_v2(
        Bucket=bucket_name, Prefix=prefix, Delimiter="/"
    )
    files = [
        obj["Key"][len(prefix) :]
        for obj in response.get("Contents", [])
        if "Key" in obj and obj["Key"] != prefix
    ]
    folders = {prefix: files}

    for common_prefix in response.get("CommonPrefixes", []):
        sub_prefix = common_prefix.get("Prefix")
        sub_folders = list_files_folders(
            s3_client=s3_client, bucket_name=bucket_name, prefix=sub_prefix
        )
        folders.update(sub_folders)

    return folders
