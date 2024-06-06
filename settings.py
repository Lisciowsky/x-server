import os

from dotenv import load_dotenv
from boto3 import Session

from enums import Environment

from loguru import logger


# NOTE Switch to local development if you re running the backend core locally
LOCAL_DEVELOPMENT = False
if LOCAL_DEVELOPMENT:
    load_dotenv("app.env")

ENVIRONMENT = os.getenv("ENVIRONMENT")
# ENVIRONMENT = Environment.TESTING

if ENVIRONMENT == Environment.TESTING:
    load_dotenv("app.env")

# AWS
REGION_NAME, AWS_PROFILE = os.getenv("REGION_NAME"), os.getenv("AWS_PROFILE")
if LOCAL_DEVELOPMENT:
    BOTO3_SESSION = Session(region_name=REGION_NAME, profile_name=AWS_PROFILE)
else:
    BOTO3_SESSION = (
        Session()
    )  # On AWS, the session inherits the region from the resource location automatically


# DB
DATABASE_URL = os.getenv("DATABASE_URL")
MOCK_DB_URL = os.getenv("MOCK_DB_URL")

# Server
SERVER_HOST = os.getenv("SERVER_HOST")
SERVER_PORT = os.getenv("SERVER_PORT")

# Storage - AWS S3
STORAGE_BUCKET_NAME = os.getenv("STORAGE_BUCKET_NAME")

# MEDIA_CONVERT_STORAGE - AWS S3
MEDIA_CONVERT_BUCKET_NAME = os.getenv("MEDIA_CONVERT_BUCKET_NAME")

# MEDIA CLOUDFRONT DOMAIN:
MEDIA_CLOUDFRONT_DOMAIN = os.getenv("MEDIA_CLOUDFRONT_DOMAIN")
MEDIA_PRIVATE_KEY_CDN_SECRET_NAME = os.getenv("MEDIA_PRIVATE_KEY_CDN_SECRET_NAME")
MEDIA_PUBLIC_KEY_CDN_SECRET_NAME = os.getenv("MEDIA_PUBLIC_KEY_CDN_SECRET_NAME")

# AUTH
JWT_SECRET = os.getenv("JWT_SECRET")
ACCESS_TOKEN_DURATION_MINUTES = os.getenv("ACCESS_TOKEN_DURATION_MINUTES")
REFRESH_TOKEN_DURATION_MINUTES = os.getenv("REFRESH_TOKEN_DURATION_MINUTES")

API_VERSION = "v1"

# DOMAIN NAME
DOMAIN_NAME = os.getenv("DOMAIN_NAME")

# SET DB_URL (MOCK / PROD)
if ENVIRONMENT == Environment.TESTING:
    DB_URL = f"postgresql://{''.join(MOCK_DB_URL.split('://')[1:])}"
else:
    DB_URL = f"postgresql://{''.join(DATABASE_URL.split('://')[1:])}"

logger.debug(
    "\n"
    f"ENVIRONMENT: {ENVIRONMENT}\n"
    f"DATABASE_URL: {DATABASE_URL}\n"
    f"MOCK_DB_URL: {MOCK_DB_URL}\n"
    f"SERVER_HOST: {SERVER_HOST}\n"
    f"SERVER_PORT: {SERVER_PORT}\n"
    f"JWT_SECRET: {JWT_SECRET}\n"
    f"ACCESS_TOKEN_DURATION_MINUTES: {ACCESS_TOKEN_DURATION_MINUTES}\n"
    f"REFRESH_TOKEN_DURATION_MINUTES: {REFRESH_TOKEN_DURATION_MINUTES}\n"
    f"API_VERSION: {API_VERSION}\n"
    f"DB_URL: {DB_URL}\n"
    f"STORAGE_BUCKET_NAME: {STORAGE_BUCKET_NAME}\n"
    f"REGION_NAME: {REGION_NAME}\n"
    f"AWS_PROFILE: {AWS_PROFILE}\n"
    f"MEDIA_CONVERT_BUCKET_NAME: {MEDIA_CONVERT_BUCKET_NAME}\n"
    f"MEDIA_CLOUDFRONT_DOMAIN: {MEDIA_CLOUDFRONT_DOMAIN}\n"
    f"MEDIA_PRIVATE_KEY_CDN_SECRET_NAME: {MEDIA_PRIVATE_KEY_CDN_SECRET_NAME}\n"
    f"MEDIA_PUBLIC_KEY_CDN_SECRET_NAME: {MEDIA_PUBLIC_KEY_CDN_SECRET_NAME}\n"
    f"DOMAIN_NAME: {DOMAIN_NAME}\n"
)
