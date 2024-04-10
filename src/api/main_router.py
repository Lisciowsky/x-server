from src.api.routes.users import users_router
from src.api.routes.storage import storage_router
from src.api.routes.admin import admin_router

from fastapi import APIRouter

# NOTE The lambda function name has to be prefixed here
main_router = APIRouter(prefix="/v1")

# USERS
main_router.include_router(users_router, tags=["Users"])
# STORAGE
main_router.include_router(storage_router, tags=["Storage"])
# ADMIN
main_router.include_router(admin_router, tags=["Admin"])
