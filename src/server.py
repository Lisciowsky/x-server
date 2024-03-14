from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from src.db.dal import DAL
from src.api.main_router import main_router

server = FastAPI(title="my web server", version="1.0.0")
dal = DAL()

# CORS middleware setup
origins = [
    "http://localhost:3000",
    "https://d2oaxem1qljagm.cloudfront.net",
    "http://d2oaxem1qljagm.cloudfront.net",
]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Or specify just the methods you need: ["GET", "POST"]
    allow_headers=["*"],  # Or specify headers you need
)


# Middleware to log responses
@server.middleware("http")
async def log_responses(request: Request, call_next):
    response = await call_next(request)
    # Log with Loguru
    logger.info(
        f"REQUEST: {request.method} {request.url} - STATUS: {response.status_code}"
    )
    return response


server.include_router(main_router)


@server.get("/healthcheck")
def healthcheck():
    return {"status": "healthy"}


@server.on_event("startup")
async def startup_event():
    try:
        await DAL().create_database_if_not_exists()
    except Exception as ex:
        logger.critical(f"failed to connect to the db: {ex}")
        raise ex
    try:
        await dal.run_migrations()
    except Exception as ex:
        logger.critical(f"failed to run db migrations: {ex}")
        raise ex
