from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from uuid import UUID


class User(SQLModel, table=True):
    username: str = Field(primary_key=True)
    role: str = Field(default="user")
    hashed_password: str
    full_name: str
    email: str = Field(nullable=False, unique=True)
    is_email_verified: bool = Field(default=False)
    password_changed_at: datetime = Field(default=datetime(1, 1, 1))
    created_at: datetime = Field(default_factory=datetime.now)
    # Relationships
    verify_emails: list["VerifyEmail"] = Relationship(back_populates="user")
    # accounts: list["Account"] = Relationship(back_populates="owner")
    sessions: list["Session"] = Relationship(back_populates="user")


class VerifyEmail(SQLModel, table=True):
    id: int = Field(primary_key=True, sa_column_kwargs={"autoincrement": True})
    username: str = Field(foreign_key="user.username")
    email: str
    secret_code: str
    is_used: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    expired_at: datetime = Field(
        default_factory=lambda: datetime.now() + timedelta(minutes=15)
    )
    # Relationships
    user: User = Relationship(back_populates="verify_emails")


# class Account(SQLModel, table=True):
# id: int = Field(primary_key=True, sa_column_kwargs={"autoincrement": True})
# owner_username: str = Field(foreign_key="user.username", alias="owner")
# created_at: datetime = Field(default_factory=datetime.now)
# # Relationships
# owner: User = Relationship(back_populates="accounts")

# class Config:
#     unique_together = [("owner_username", "currency")]


class Session(SQLModel, table=True):
    id: UUID = Field(primary_key=True)
    username: str = Field(foreign_key="user.username")
    refresh_token: str
    user_agent: str
    client_ip: str
    is_blocked: bool = Field(default=False)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.now)
    # Relationships
    user: User = Relationship(back_populates="sessions")