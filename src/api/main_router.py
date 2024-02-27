from src.api.routes.users import users_router
from src.api.routes.auth import auth_router

from fastapi import APIRouter

main_router = APIRouter(prefix="/v1")

# AUTH
main_router.include_router(auth_router)
# USERS
main_router.include_router(users_router)
