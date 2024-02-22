from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select

from src.db.models import User


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


async def update_user(
    async_session: AsyncSession, username: str, update_fields: dict
) -> User:
    try:
        async with async_session() as session:
            # Query the user by id
            stmt = select(User).where(User.username == username)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()
            if user:
                # Update fields
                for key, value in update_fields.items():
                    setattr(user, key, value)
                await session.commit()
                await session.refresh(user)
                return user
            else:
                return None  # User not found
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def delete_user(async_session: AsyncSession, username: str):
    try:
        async with async_session() as session:
            stmt = select(User).where(User.username == username)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()
            if user:
                await session.delete(user)
                await session.commit()
            else:
                return None  # User not found
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_user(async_session: AsyncSession, username: str) -> User:
    try:
        async with async_session() as session:
            stmt = select(User).where(User.username == username)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()
            return user
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex
