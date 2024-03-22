from typing import List, Optional
from datetime import datetime

from fastapi import Depends, APIRouter, HTTPException, status
from loguru import logger
from pydantic import BaseModel, Field

from src.token.token_maker import get_current_user, UserPayload
from src.db.dal import DAL

admin_router = APIRouter(prefix="/admin")


class UserOut(BaseModel):
    username: str
    full_name: str
    email: str
    role: str
    is_email_verified: bool
    password_changed_at: datetime
    created_at: datetime


class PaginatedUsersResponse(BaseModel):
    page: int = Field(..., example=100)
    page_size: int = Field(..., example=100)
    total_users: int = Field(..., example=100)
    users: List[UserOut]


@admin_router.get("/all_users", response_model=PaginatedUsersResponse)
async def get_all_users(
    page: int = 1,
    page_size: int = 10,
    current_user: UserPayload = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    try:
        users, total_users, page, page_size = await DAL().get_all_users(
            page=page, page_size=page_size
        )
    except Exception as ex:
        logger.warning(f"Failed to fetch users: {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch users",
        )

    return {
        "page": page,
        "page_size": page_size,
        "total_users": total_users,
        "users": [UserOut(**user.__dict__) for user in users],
    }


class UpdateUserRequest(BaseModel):
    role: Optional[str] = None


class UpdateUserResponse(BaseModel):
    success: bool
    username: str
    role: str


@admin_router.put("/update_role/{username}", response_model=UpdateUserResponse)
async def update_user(
    username: str,
    update_request: UpdateUserRequest,
    current_user: UserPayload = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    try:
        user = await DAL().get_user(username=username)
    except Exception as ex:
        logger.error(f"Failed to get user: {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if current_user.username == user.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User can't edit his own role"
        )

    if update_request.role:
        user.role = update_request.role

    await DAL().update_user(username=username, user=user)

    return UpdateUserResponse(success=True, username=username, role=user.role)
