from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from src.db.dal import DAL
from src.api.main_router import main_router
from src.utils.db_startup import create_database_if_not_exists

import settings

server = FastAPI(title="my web server", version="1.0.0")
dal = DAL()

# CORS middleware setup
origins = [
    "http://localhost:3000",  # Adjust this to the origins you want to allow
    "https://yourfrontenddomain.com",
]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Or specify just the methods you need: ["GET", "POST"]
    allow_headers=["*"],  # Or specify headers you need
)

server.include_router(main_router)


@server.on_event("startup")
async def startup_event():
    try:
        await create_database_if_not_exists(url=settings.DB_URL)
    except Exception as ex:
        logger.critical(f"failed to connect to the db: {ex}")
        raise ex
    try:
        await dal.run_migrations()
    except Exception as ex:
        logger.critical(f"failed to run db migrations: {ex}")
        raise ex
