from dotenv import load_dotenv
import os

load_dotenv("app.env")

DATABASE_URL = os.getenv("DATABASE_URL")
MOCK_DB_URL = os.getenv("MOCK_DB_URL")

SERVER_HOST = os.getenv("SERVER_HOST")
SERVER_PORT = os.getenv("SERVER_PORT")

JWT_SECRET = os.getenv("JWT_SECRET")
ACCESS_TOKEN_DURATION_MINUTES = os.getenv("ACCESS_TOKEN_DURATION_MINUTES")
REFRESH_TOKEN_DURATION_MINUTES = os.getenv("REFRESH_TOKEN_DURATION_MINUTES")
