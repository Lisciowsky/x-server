from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from settings import DATABASE_URL

from src.db.models import User
from src.db.user import create_user


class DAL:
    _instance = None  # Class attribute to store the singleton instance

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # Initialize the engine here the first time the DAL class is instantiated.
            async_engine = create_async_engine(url=DATABASE_URL, echo=True)
            cls._instance.async_session = async_sessionmaker(
                async_engine, expire_on_commit=False, class_=AsyncSession
            )
        return cls._instance

    def __init__(self) -> None:
        # __init__ can remain empty if there's no other initialization required.
        pass

    async def create_user(self, user: User):
        return await create_user(async_session=self.async_session, user=user)

    # async def create_all(self):
    #     # Use the engine directly from the instance for database operations.
    #     async_session = self.async_session()
    #     async with async_session as session:
    #         async with session.begin():
    #             # Ensure SQLModel.metadata.create_all is called with your actual models' metadata
    #             await session.run_sync(SQLModel.metadata.create_all)
