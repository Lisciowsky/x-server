from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from src.db.dal import DAL
from src.token.token_maker import JWTTokenManager


auth_router = APIRouter(prefix="/auth")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class RenewAccessRequest(BaseModel):
    session_id: str


class RenewAccessResponse(BaseModel):
    access_token: str
    access_token_expires_at: datetime


@auth_router.post("/renew_access", response_model=RenewAccessResponse)
async def renew_access_token(renew_request: RenewAccessRequest):
    session = await DAL().get_session(session_id=renew_request.session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid or expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if datetime.utcnow() >= session.expires_at:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        access_token, access_payload = JWTTokenManager.create_token(
            username=session.username,
            role="user",  # TODO CHANGE THIS somehow get from the session the role.
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create access token",
        )

    return RenewAccessResponse(
        access_token=access_token,
        access_token_expires_at=access_payload["exp"],
    )


class TokenData(BaseModel):
    username: str
    role: str


class VerifyTokenResponse(BaseModel):
    username: str
    role: str
    is_valid: bool


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = JWTTokenManager.verify_token(token)
        username: str = payload.get("username")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        role: str = payload.get(
            "role", "user"
        )  # Default to "user" role if not specified
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenData(username=username, role=role)


@auth_router.get("/verify_token", response_model=VerifyTokenResponse)
async def verify_token(current_user: TokenData = Depends(get_current_user)):
    return VerifyTokenResponse(
        username=current_user.username, role=current_user.role, is_valid=True
    )
