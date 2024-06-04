from dotenv import load_dotenv
import os
from enum import Enum

# NOTE Switch to local development if you re running the backend core locally
LOCAL_DEVELOPMENT = False

if LOCAL_DEVELOPMENT:
    load_dotenv("app.env")


class Environment(str, Enum):
    TESTING = "TESTING"
    PRODUCTION = "PRODUCTION"


ENVIRONMENT = os.getenv("ENVIRONMENT")

if not Environment:
    raise ValueError("Could not determine the environemnt")

if ENVIRONMENT == Environment.TESTING:
    load_dotenv("app.env")

# DB
DATABASE_URL = os.getenv("DATABASE_URL")
MOCK_DB_URL = os.getenv("MOCK_DB_URL")

# Server
SERVER_HOST = os.getenv("SERVER_HOST")
SERVER_PORT = os.getenv("SERVER_PORT")

# Storage - AWS S3
STORAGE_BUCKET_NAME = os.getenv("STORAGE_BUCKET_NAME")
REGION_NAME = os.getenv("REGION_NAME")

# MEDIA_CONVERT_STORAGE - AWS S3
MEDIA_CONVERT_BUCKET_NAME = os.getenv("MEDIA_CONVERT_BUCKET_NAME")

# MEDIA CLOUDFRONT DOMAIN:
MEDIA_CLOUDFRONT_DOMAIN = os.getenv("MEDIA_CLOUDFRONT_DOMAIN")
MEDIA_PRIVATE_KEY_CDN_SECRET_NAME = os.getenv("MEDIA_PRIVATE_KEY_CDN_SECRET_NAME")
MEDIA_CDN_PUBLIC_KEY_SECRET_NAME = os.getenv("MEDIA_CDN_PUBLIC_KEY_SECRET_NAME")

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


variables_to_print = [
    "ENVIRONMENT",
    "DATABASE_URL",
    "MOCK_DB_URL",
    "SERVER_HOST",
    "SERVER_PORT",
    "JWT_SECRET",
    "ACCESS_TOKEN_DURATION_MINUTES",
    "REFRESH_TOKEN_DURATION_MINUTES",
    "API_VERSION",
    "DB_URL",
    "STORAGE_BUCKET_NAME",
    "REGION_NAME",
    "MEDIA_CONVERT_BUCKET_NAME",
    "MEDIA_CLOUDFRONT_DOMAIN",
    "MEDIA_PRIVATE_KEY_CDN_SECRET_NAME",
    "MEDIA_CDN_PUBLIC_KEY_SECRET_NAME",
    "DOMAIN_NAME",
]

for var in variables_to_print:
    value = globals().get(var, None)
    print(f"{var}: {value}")
