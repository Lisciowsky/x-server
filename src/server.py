from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.db.dal import DAL
from src.api.main_router import main_router

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

# @server.on_event("startup")
# async def startup_event():
#     await dal.create_all()  # Create tables if they don't exist


# @server.on_event("shutdown")
# async def shutdown_event():
#     await dal.engine.dispose()  # Properly close database connections
