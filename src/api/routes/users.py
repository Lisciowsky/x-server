from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, constr
from loguru import logger

from src.db.dal import DAL
from src.db.models import User, Session
from src.utils.password import hash_password

from src.utils.password import verify_password
from src.token.token_maker import JWTTokenManager, get_current_user, UserPayload

from settings import REFRESH_TOKEN_DURATION_MINUTES

users_router = APIRouter(prefix="/users")


class CreateUserRequest(BaseModel):
    username: str
    password: str
    fullname: str
    email: str


class CreateUserResponse(BaseModel):
    username: str
    fullname: str
    email: str
    role: str


@users_router.post(
    "/", response_model=CreateUserResponse, status_code=status.HTTP_201_CREATED
)
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
            logger.warning(f"create user exception ex: {ex}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="unable to create user due to conflict",
            )
        if "Connect call failed" in ex.strerror:
            logger.critical(f"db connection failed: {ex}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    user_response = CreateUserResponse(
        username=user.username,
        fullname=user.full_name,
        email=user.email,
        role=user.role,
    )

    return user_response


class LoginUserRequest(BaseModel):
    username: constr(pattern="^[a-zA-Z0-9]+$")
    password: constr(min_length=6)


class LoginUserResponse(BaseModel):
    session_id: str
    access_token: str
    access_token_expires_at: datetime
    refresh_token: str
    refresh_token_expires_at: datetime
    user: CreateUserResponse


@users_router.post("/login", response_model=LoginUserResponse)
async def login_user(login_request: LoginUserRequest):
    try:
        user = await DAL().get_user(username=login_request.username)
    except Exception as ex:
        ex_msg = "unable to get user"
        logger.warning(ex_msg + f": {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ex_msg
        )

    if not user:
        logger.warning("user not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if not verify_password(
        plain_password=login_request.password, hashed_password=user.hashed_password
    ):
        ex_msg = "invalid password"
        logger.warning(ex_msg)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=ex_msg)

    try:
        access_token, access_payload = JWTTokenManager.create_token(
            username=user.username, role=user.role
        )
    except Exception as ex:
        ex_msg = "unable to create access_token for user"
        logger.warning(ex_msg + f": {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ex_msg,
        )

    try:
        refresh_token, refresh_payload = JWTTokenManager.create_token(
            username=user.username,
            role=user.role,
            expires_delta=timedelta(minutes=int(REFRESH_TOKEN_DURATION_MINUTES)),
        )
    except Exception as ex:
        ex_msg = "unable to create refresh_token for user"
        logger.warning(ex_msg + f": {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ex_msg
        )

    session = Session(
        id=refresh_payload.id,
        username=user.username,
        refresh_token=refresh_token,
        user_agent="",
        client_ip="",
        expires_at=refresh_payload.exp,
    )
    try:
        created_session = await DAL().create_session(new_session=session)
    except Exception as ex:
        if isinstance(ex, IntegrityError):
            ex_msg = "unable to create user due to conflict"
            logger.warning(ex_msg + f": {ex}")

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=ex_msg,
            )
        ex_msg = "unable to create session"
        logger.warning(ex_msg + f": {ex}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ex_msg
        )

    login_response = LoginUserResponse(
        session_id=str(created_session.id),
        user=CreateUserResponse(
            username=user.username,
            fullname=user.full_name,
            email=user.email,
            role=user.role,
        ),
        access_token=access_token,
        access_token_expires_at=access_payload.exp,
        refresh_token=refresh_token,
        refresh_token_expires_at=refresh_payload.exp,
    )

    return login_response


@users_router.get("/{username}", response_model=CreateUserResponse)
async def get_user(
    username: str, current_user: UserPayload = Depends(get_current_user)
):
    if username != current_user.username and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    try:
        # Assuming DAL.get_user_by_id is a method to fetch a user by ID
        user = await DAL().get_user(username=username)
    except Exception as ex:
        ex_msg = "Failed to fetch user"
        logger.warning(ex_msg + f": {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ex_msg,
        )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return CreateUserResponse(
        username=user.username,
        fullname=user.full_name,
        email=user.email,
        role=user.role,
    )
