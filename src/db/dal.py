from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from uuid import UUID
from src.db.models import User, Session
from src.db.user import create_user, delete_user, get_user, update_user
from src.db.session import get_session, create_session
from settings import DATABASE_URL, DB_URL


class DAL:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, db_url=None) -> None:
        # Allow specifying a different database URL, e.g., for testing
        self.db_url = db_url or DATABASE_URL
        self.async_engine = create_async_engine(url=self.db_url, echo=False)
        self.async_session = async_sessionmaker(
            self.async_engine, expire_on_commit=False, class_=AsyncSession
        )

    # USER TABLE
    async def get_user(self, username: int):
        return await get_user(async_session=self.async_session, username=username)

    async def create_user(self, user: User):
        return await create_user(async_session=self.async_session, user=user)

    async def update_user(self, username: str, update_fields: dict):
        return await update_user(
            async_session=self.async_session,
            username=username,
            update_fields=update_fields,
        )

    async def delete_user(self, username: str):
        return await delete_user(async_session=self.async_session, username=username)

    # SESSION TABLE
    async def create_session(self, new_session: Session):
        return await create_session(
            async_session=self.async_session, new_session=new_session
        )

    async def get_session(self, session_id: UUID):
        return await get_session(
            async_session=self.async_session, session_id=session_id
        )

    async def run_migrations(self):
        from alembic.config import Config
        from alembic import command
        import os

        # Specify the location of your Alembic configuration file
        alembic_cfg = Config(
            os.path.join(os.path.dirname(__file__), "../../alembic.ini")
        )

        # Optionally, override the sqlalchemy.url setting in alembic.ini dynamically
        alembic_cfg.set_main_option("sqlalchemy.url", DB_URL)

        # Apply the 'head' migration to the database
        command.upgrade(alembic_cfg, "head")
