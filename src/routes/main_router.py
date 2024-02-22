from src.routes.users import users_router
from src.routes.auth import auth_router

from fastapi import APIRouter

main_router = APIRouter()

# AUTH
main_router.include_router(auth_router)
# USERS
main_router.include_router(users_router)
