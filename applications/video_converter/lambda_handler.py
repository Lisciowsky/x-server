from pprint import pprint
import os
import boto3

import settings


def lambda_handler(event, context):
    print("---------------------------")
    pprint(event)
    print("---------------------------")

    client = boto3.client(
        "mediaconvert",
        endpoint_url=os.environ.get("MEDIA_CONVERT_ENDPOINT"),
        region_name="eu-central-1",
    )

    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]

    username = key.split("/")[1]

    job_settings = {
        "Inputs": [
            {
                "FileInput": f"s3://{bucket}/{key}",
                "AudioSelectors": {"Audio Selector 1": {"DefaultSelection": "DEFAULT"}},
            }
        ],
        "OutputGroups": [
            {
                "Name": "File Group",
                "Outputs": [{"Preset": "BasicMP4VideoPreset", "NameModifier": "_1"}],
                "OutputGroupSettings": {
                    "Type": "FILE_GROUP_SETTINGS",
                    "FileGroupSettings": {
                        "Destination": f"s3://{settings.OUTPUT_BUCKET}/output/{username}/"
                    },
                },
            }
        ],
    }

    # Create the MediaConvert job
    response = client.create_job(
        Role=settings.MEDIA_CONVERT_ROLE_ARN, Settings=job_settings
    )

    print("response:")
    print(response)

    return response


if __name__ == "__main__":
    event = {
        "Records": [
            {
                "awsRegion": "eu-central-1",
                "eventName": "ObjectCreated:Put",
                "eventSource": "aws:s3",
                "eventTime": "2024-04-25T21:27:33.634Z",
                "eventVersion": "2.1",
                "requestParameters": {"sourceIPAddress": "193.200.82.56"},
                "responseElements": {
                    "x-amz-id-2": "GGSquVO8taFcyxBt1x+wrU5JceoVLoCbZEpGnEE+TeZhWDFpvbs0+26+hpsttXo9ZCMj8/Y2mQ9c6U5GnXOPEjXxsbNYoIYi",
                    "x-amz-request-id": "SNZRVDCV4Y2C56CS",
                },
                "s3": {
                    "bucket": {
                        "arn": "arn:aws:s3:::dev-video-content-20240425104111676300000002",
                        "name": "dev-video-content-20240425104111676300000002",
                        "ownerIdentity": {"principalId": "A3PF9MGAVG3N18"},
                    },
                    "configurationId": "tf-s3-lambda-20240425195143642700000001",
                    "object": {
                        "eTag": "a3ab8bccb18b8af34f280d7c0056501d",
                        "key": "uploads/20230802_185646_1.mp4",
                        "sequencer": "00662ACAC412C63B5D",
                        "size": 15165638,
                    },
                    "s3SchemaVersion": "1.0",
                },
                "userIdentity": {"principalId": "A3PF9MGAVG3N18"},
            }
        ]
    }
    lambda_handler(event=event, context=None)
