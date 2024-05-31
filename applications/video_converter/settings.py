import os
from dotenv import load_dotenv

# NOTE Switch to local development if you re running the backend core app locally
LOCAL_DEVELOPMENT = False

if LOCAL_DEVELOPMENT:
    load_dotenv("./applications/video_converter/app.env")

OUTPUT_BUCKET = os.environ["OUTPUT_BUCKET"]
MEDIA_CONVERT_ROLE_ARN = os.environ["MEDIA_CONVERT_ROLE_ARN"]
