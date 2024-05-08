from datetime import datetime, timedelta
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
    created_at: datetime = Field(default_factory=datetime.utcnow)
    verify_emails: list["VerifyEmail"] = Relationship(back_populates="user")
    sessions: list["Session"] = Relationship(back_populates="user")
    granted_permissions: list["MediaPermission"] = Relationship(back_populates="user")


class Media(SQLModel, table=True):
    id: int = Field(primary_key=True, sa_column_kwargs={"autoincrement": True})
    media_owner: str = Field(foreign_key="user.username")
    media_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: datetime = Field(default=datetime(1, 1, 1))
    size_in_mb: float = Field(
        default=0.0, description="Size of the media file in megabytes"
    )
    permissions: list["MediaPermission"] = Relationship(back_populates="media")


class MediaPermission(SQLModel, table=True):
    id: int = Field(primary_key=True, sa_column_kwargs={"autoincrement": True})
    media_id: int = Field(foreign_key="media.id")
    granted_to_username: str = Field(foreign_key="user.username")
    permission_type: str  # This can be 'view', 'edit', etc.
    granted_at: datetime = Field(default_factory=datetime.utcnow)
    media: Media = Relationship(back_populates="permissions")
    user: User = Relationship(back_populates="granted_permissions")


class VerifyEmail(SQLModel, table=True):
    id: int = Field(primary_key=True, sa_column_kwargs={"autoincrement": True})
    username: str = Field(foreign_key="user.username")
    email: str
    secret_code: str
    is_used: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expired_at: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(minutes=15)
    )
    user: User = Relationship(back_populates="verify_emails")


class Session(SQLModel, table=True):
    id: UUID = Field(primary_key=True)
    username: str = Field(foreign_key="user.username")
    refresh_token: str
    user_agent: str
    client_ip: str
    is_blocked: bool = Field(default=False)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user: User = Relationship(back_populates="sessions")
