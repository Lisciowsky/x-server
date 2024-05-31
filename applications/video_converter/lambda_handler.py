from typing import Optional
import os
import boto3
from urllib.parse import unquote_plus

import settings

from loguru import logger


def _get_job_settings(bucket: str, key: str, username: str) -> dict:
    return {
        "Inputs": [
            {
                "FileInput": f"s3://{bucket}/{key}",
                "AudioSelectors": {"Audio Selector 1": {"DefaultSelection": "DEFAULT"}},
            }
        ],
        "OutputGroups": [
            {
                "Name": "File Group",
                "Outputs": [
                    {"Preset": "BasicMP4VideoPreset"}
                ],  # "NameModifier": "_1" - for suffix added to file name
                "OutputGroupSettings": {
                    "Type": "FILE_GROUP_SETTINGS",
                    "FileGroupSettings": {
                        "Destination": f"s3://{settings.OUTPUT_BUCKET}/output/{username}/"
                    },
                },
            }
        ],
    }


def lambda_handler(event: dict, _: Optional[dict] = None):
    logger.info(event)
    client = boto3.client(
        "mediaconvert",
        endpoint_url=os.environ.get("MEDIA_CONVERT_ENDPOINT"),
        region_name="eu-central-1",
    )

    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = unquote_plus(event["Records"][0]["s3"]["object"]["key"])
    username = key.split("/")[1]

    job_settings = _get_job_settings(bucket=bucket, key=key, username=username)
    response = client.create_job(
        Role=settings.MEDIA_CONVERT_ROLE_ARN, Settings=job_settings
    )

    logger.debug(f"response: {response}")

    return response


if __name__ == "__main__":
    event = {
        "Records": [
            {
                "eventVersion": "2.1",
                "eventSource": "aws:s3",
                "awsRegion": "eu-central-1",
                "eventTime": "2024-05-31T22:42:11.604Z",
                "eventName": "ObjectCreated:Put",
                "userIdentity": {"principalId": "AWS:AIDAZQ3DPJTOI6KJD7XHK"},
                "requestParameters": {"sourceIPAddress": "193.200.82.56"},
                "responseElements": {
                    "x-amz-request-id": "EMASD9EWM446WVFM",
                    "x-amz-id-2": "Q8Js494wB1SzbkMc2L66Ljzwr9Z1YxX+qneHjabpipCG3bcCWtHf3WRDDH86CVyU9TP9oFjBCYY7sjWk1kSYLr2hNcpzxiVY",
                },
                "s3": {
                    "s3SchemaVersion": "1.0",
                    "configurationId": "tf-s3-lambda-20240524214756774800000003",
                    "bucket": {
                        "name": "dev-video-content-20240524212705497000000004",
                        "ownerIdentity": {"principalId": "A3PF9MGAVG3N18"},
                        "arn": "arn:aws:s3:::dev-video-content-20240524212705497000000004",
                    },
                    "object": {
                        "key": "uploads/hahahaha/What+perfect+running+technique+looks+like+%28mtn_techne%29.mp4",
                        "size": 1477837,
                        "eTag": "65322d11c6bb8904d2e5db2000d631ee",
                        "sequencer": "00665A5243870ACA90",
                    },
                },
            }
        ]
    }
    lambda_handler(event=event)
