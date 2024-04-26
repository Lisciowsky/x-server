from uuid import UUID

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.engine.url import make_url
from sqlalchemy import text

from src.db.models import User, Session, Media
from src.db.user import (
    create_user,
    delete_user,
    get_user,
    update_user,
    get_all_users,
    search_users,
)
from src.db.session import get_session, create_session
from src.db.media import create_media, get_media

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
        # NOTE During stress tests with 100 simultaneous requests, the application may exceed the set connection pool size of 10, leading to additional connections being created. This surge can cause
        # PostgreSQL to reach its connection limit and refuse new connections, highlighting the need for careful configuration under high-load scenarios.
        self.async_engine = create_async_engine(
            url=self.db_url,
            pool_pre_ping=True,
            # Add pool size configuration below
            # echo_pool=True,  # Optional: for debugging, shows pool checkouts/checkins
            # pool_size=1,  # The number of connections to keep open inside the connection pool
            # max_overflow=0,  # The number of connections to allow in overflow, beyond the pool_size
            # pool_timeout=30,  # The number of seconds to wait before giving up on returning a connection from the pool
            # pool_recycle=1800,  # The number of seconds after which a connection is automatically recycled
        )
        self.async_session = async_sessionmaker(self.async_engine, class_=AsyncSession)

    # USER TABLE
    async def get_all_users(self, page: int = 1, page_size: int = 10):
        return await get_all_users(
            async_session=self.async_session, page=page, page_size=page_size
        )

    async def get_user(self, username: int):
        return await get_user(async_session=self.async_session, username=username)

    async def create_user(self, user: User):
        return await create_user(async_session=self.async_session, user=user)

    async def update_user(self, username: str, user: User):
        return await update_user(
            async_session=self.async_session, username=username, updated_user=user
        )

    async def delete_user(self, username: str):
        return await delete_user(async_session=self.async_session, username=username)

    async def search_users(self, username: str, email: str, fullname: str, role: str):
        return await search_users(
            async_session=self.async_session,
            username=username,
            email=email,
            fullname=fullname,
            role=role,
        )

    # SESSION TABLE
    async def create_session(self, new_session: Session):
        return await create_session(
            async_session=self.async_session, new_session=new_session
        )

    async def get_session(self, session_id: UUID):
        return await get_session(
            async_session=self.async_session, session_id=session_id
        )

    # MEDIA TABLE
    async def create_media(self, new_media: Media) -> Media:
        return await create_media(async_session=self.async_session, new_media=new_media)

    async def get_media(self, media_name: str, owner_username: str):
        return await get_media(
            async_session=self.async_session,
            media_name=media_name,
            owner_username=owner_username,
        )

    async def run_migrations(self):
        from alembic.config import Config
        from alembic import command
        import os

        alembic_cfg = Config(
            os.path.join(os.path.dirname(__file__), "../../alembic.ini")
        )

        alembic_cfg.set_main_option("sqlalchemy.url", DB_URL)

        command.upgrade(alembic_cfg, "head")

    async def create_database_if_not_exists(self):
        db_url = make_url(self.db_url)
        temp_engine = create_async_engine(
            url=db_url.set(database="postgres"), echo=True
        )

        async with temp_engine.connect() as conn:
            await conn.execute(text("COMMIT"))
            db_exists = await conn.execute(
                text("SELECT EXISTS(SELECT FROM pg_database WHERE datname = :dbname)"),
                {"dbname": db_url.database},
            )
            db_exists = db_exists.scalar()

            if not db_exists:
                await conn.execute(text(f"CREATE DATABASE {db_url.database}"))
                print(f"Database {db_url.database} created.")
            else:
                print(f"Database {db_url.database} already exists.")
