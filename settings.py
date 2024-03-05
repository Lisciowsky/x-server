from dotenv import load_dotenv
import os
from enum import Enum


class Environment(str, Enum):
    TESTING = "TESTING"
    PRODUCTION = "PRODUCTION"


ENVIRONMENT = os.getenv("ENVIRONMENT")
# ENVIRONMENT = "TESTING"

if not Environment:
    raise ValueError("Could not determine the environemnt")

if ENVIRONMENT == Environment.TESTING:
    load_dotenv("app.env")


DATABASE_URL = os.getenv("DATABASE_URL")
MOCK_DB_URL = os.getenv("MOCK_DB_URL")

SERVER_HOST = os.getenv("SERVER_HOST")
SERVER_PORT = os.getenv("SERVER_PORT")

JWT_SECRET = os.getenv("JWT_SECRET")
ACCESS_TOKEN_DURATION_MINUTES = os.getenv("ACCESS_TOKEN_DURATION_MINUTES")
REFRESH_TOKEN_DURATION_MINUTES = os.getenv("REFRESH_TOKEN_DURATION_MINUTES")

API_VERSION = "v1"

# SET DB_URL (MOCK / PROD)
DB_URL = DATABASE_URL
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
]

for var in variables_to_print:
    value = globals().get(var, None)  # Retrieve value from the global namespace
    print(f"{var}: {value}")