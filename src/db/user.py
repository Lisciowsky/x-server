from typing import Tuple

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy import func

from src.db.models import User


async def get_user_count(session: AsyncSession):
    stmt = select(func.count()).select_from(User)
    result = await session.execute(stmt)
    count = result.scalar_one()
    return count


async def create_user(async_session: AsyncSession, user: User) -> User:
    try:
        async with async_session() as session:
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def update_user(
    async_session: AsyncSession, username: str, update_fields: dict
) -> User:
    try:
        async with async_session() as session:
            stmt = select(User).where(User.username == username)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()
            if user:
                for key, value in update_fields.items():
                    setattr(user, key, value)
                await session.commit()
                await session.refresh(user)
                return user
            else:
                return None
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
                return None
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


async def get_all_users(
    async_session: AsyncSession, page: int = 1, page_size: int = 10
) -> Tuple[list[User], int, int, int]:
    try:
        async with async_session() as session:
            offset = (page - 1) * page_size

            stmt = select(User).limit(page_size).offset(offset)
            result = await session.execute(stmt)

            users = result.scalars().all()

            total_users = await get_user_count(session=session)

            return users, total_users, page, page_size
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex
