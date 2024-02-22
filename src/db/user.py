from src.db.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError


async def create_user(async_session: AsyncSession, user: User) -> User:
    try:
        async with async_session() as session:  # Correctly obtaining an AsyncSession instance
            session.add(user)
            await session.commit()  # Await the commit
            await session.refresh(user)  # Await the refresh
            return user
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex
