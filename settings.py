from dotenv import load_dotenv
import os
from enum import Enum


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
BUCKET_NAME = os.getenv("BUCKET_NAME")
BUCKET_REGION_NAME = os.getenv("BUCKET_REGION_NAME")

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
    "BUCKET_NAME",
    "BUCKET_REGION_NAME",
    "MEDIA_CONVERT_BUCKET_NAME",
    "MEDIA_CLOUDFRONT_DOMAIN",
    "MEDIA_PRIVATE_KEY_CDN_SECRET_NAME",
    "MEDIA_CDN_PUBLIC_KEY_SECRET_NAME"
]

for var in variables_to_print:
    value = globals().get(var, None)  # Retrieve value from the global namespace
    print(f"{var}: {value}")
