from dotenv import load_dotenv
import os

load_dotenv("app.env")

DATABASE_URL = os.getenv("DATABASE_URL")

SERVER_HOST = os.getenv("SERVER_HOST")
SERVER_PORT = os.getenv("SERVER_PORT")
