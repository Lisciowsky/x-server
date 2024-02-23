from uuid import UUID
from fastapi import APIRouter, HTTPException, status, Response
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, constr
from datetime import datetime, timedelta

from src.db.dal import DAL
from src.db.models import User, Session
from src.utils.password import hash_password

from src.utils.password import verify_password
from src.token.token_maker import JWTTokenManager

from settings import REFRESH_TOKEN_DURATION_MINUTES

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


class LoginUserRequest(BaseModel):
    username: constr(regex="^[a-zA-Z0-9]+$")
    password: constr(min_length=6)


class LoginUserResponse(BaseModel):
    session_id: UUID
    username: str  # Alphanumeric characters only
    access_token: str
    acess_token_expires_at: datetime
    refresh_token: str
    refresh_token_expires_at: datetime
    user: UserResponse


@users_router.post("/login")
async def login_user(login_request: LoginUserRequest):
    try:
        user = await DAL().get_user(username=login_request.username)
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ex.orig)
        )

    if not user:
        return Response(content=[], status_code=status.HTTP_404_NOT_FOUND)

    if not verify_password(
        plain_password=login_request.password, hashed_password=user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid password"
        )

    try:
        access_token, access_payload = JWTTokenManager.create_token(
            username=user.username, role=user.role
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ex.orig)
        )

    try:
        refresh_token, refresh_payload = JWTTokenManager.create_token(
            username=user.username,
            role=user.role,
            expires_delta=timedelta(minutes=int(REFRESH_TOKEN_DURATION_MINUTES)),
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ex.orig)
        )

    session = Session(
        id=refresh_payload
        username=user.username,
        refresh_token=refresh_token,
        user_agent="",
        client_ip="",

    )

    DAL().create_session()

@users_router.get("/{user_id}")
async def get_user(user_id: int):
    return {"message": f"Fetching user {user_id}"}
