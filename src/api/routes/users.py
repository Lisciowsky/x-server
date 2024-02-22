from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel

from src.db.dal import DAL
from src.db.models import User
from src.utils.password import hash_password

users_router = APIRouter(prefix="/users")


class CreateUserRequest(BaseModel):
    username: str
    password: str
    fullname: str
    email: str


class UserResponse(BaseModel):
    username: str
    fullname: str
    email: str


@users_router.post("/")
async def create_user(user_request: CreateUserRequest):
    hashed_password = hash_password(password=user_request.password)

    user = User(
        email=user_request.email,
        full_name=user_request.fullname,
        username=user_request.username,
        hashed_password=hashed_password,
    )

    try:
        user = await DAL().create_user(user=user)
    except Exception as ex:
        if isinstance(ex, IntegrityError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail=str(ex.orig)
            )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return user.model_dump()


@users_router.get("/{user_id}")
async def get_user(user_id: int):
    return {"message": f"Fetching user {user_id}"}
