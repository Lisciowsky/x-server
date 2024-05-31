from typing import Tuple, List, Optional

from sqlalchemy import func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from src.db.models import Media, MediaPermission
from src.db.enums import PermissionTypes


async def get_media_count(session: AsyncSession, username: Optional[str] = None) -> int:
    stmt = select(func.count()).select_from(Media)
    if username is not None:
        stmt = stmt.where(Media.media_owner == username)

    result = await session.execute(stmt)
    count = result.scalar_one()
    return count


async def create_media(async_session: AsyncSession, new_media: Media) -> Media:
    async with async_session.begin() as session:
        try:
            session.add(new_media)
            await session.flush()
            media_permission = MediaPermission(
                granted_to_username=new_media.media_owner,
                media_id=new_media.id,
                permission_type=PermissionTypes.OWNER,
            )
            session.add(media_permission)
            await session.refresh(new_media)
        except SQLAlchemyError as ex:
            await session.rollback()
            raise ex
        session.expunge(new_media)
    return new_media


async def get_media(
    async_session: AsyncSession, media_name: str, owner_username: str
) -> Media:
    try:
        async with async_session() as session:
            query = select(Media).where(
                Media.media_name == media_name, Media.media_owner == owner_username
            )
            result = await session.execute(query)
            media = result.scalars().first()
            if not media:
                return None
            return media
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_media_by_id(async_session: AsyncSession, media_id: str) -> Media:
    try:
        async with async_session() as session:
            query = select(Media).where(Media.id == media_id)
            result = await session.execute(query)
            media = result.scalars().first()
            if not media:
                return None
            return media
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_permission_for_user(
    async_session: AsyncSession, media_id: int, username: str
) -> MediaPermission:
    try:
        async with async_session() as session:
            query = select(MediaPermission).where(
                MediaPermission.media_id == media_id,
                MediaPermission.granted_to_username == username,
            )
            result = await session.execute(query)
            return result.scalars().first()
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_all_media(
    async_session: AsyncSession,
    page: int = 1,
    page_size: int = 10,
    username: Optional[str] = None,
    media_owner: bool = False,
    media_permission: bool = False,
) -> Tuple[List[Media], int, int, int]:
    try:
        async with async_session() as session:
            offset = (page - 1) * page_size

            stmt = (
                select(Media)
                .order_by(desc(Media.created_at))
                .limit(page_size)
                .offset(offset)
            )

            if media_owner is not None:
                stmt = stmt.where(Media.media_owner == username)

            if media_permission:
                stmt = stmt.join(
                    MediaPermission, Media.id == MediaPermission.media_id
                ).where(MediaPermission.granted_to_username == username)

            result = await session.execute(stmt)
            media = result.scalars().all()

            if username:
                total_media = await get_media_count(session, username=username)
            else:
                total_media = await get_media_count(session)

            return media, total_media, page, page_size
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def get_all_media(
    async_session: AsyncSession,
    page: int = 1,
    page_size: int = 10,
    username: Optional[str] = None,
    media_owner: bool = False,
    media_permission: bool = False,
) -> Tuple[List[Media], int, int, int]:
    try:
        async with async_session() as session:
            offset = (page - 1) * page_size
            stmt = select(Media).order_by(Media.created_at.desc())

            if media_owner:
                stmt = stmt.where(Media.media_owner == username)
            if media_permission:
                stmt = stmt.join(
                    MediaPermission, Media.id == MediaPermission.media_id
                ).where(
                    MediaPermission.granted_to_username == username
                )  #    .where(MediaPermission.permission_type.in_(['view', 'edit']))

            stmt = stmt.limit(page_size).offset(offset)
            result = await session.execute(stmt)
            media = result.scalars().all()

            if media_owner:
                total_media_stmt = select(func.count(Media.id)).where(
                    Media.media_owner == username
                )
            if media_permission:
                total_media_stmt = (
                    select(func.count(Media.id))
                    .join(MediaPermission, Media.id == MediaPermission.media_id)
                    .where(MediaPermission.granted_to_username == username)
                )  #    .where(MediaPermission.permission_type.in_(['view', 'edit']))

            total_media_result = await session.execute(total_media_stmt)
            total_media = total_media_result.scalar_one()

            return media, total_media, page, page_size
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def delete_media_by_id(async_session: AsyncSession, media_id: str):
    try:
        async with async_session() as session:
            stmt = select(Media).where(Media.id == media_id)
            result = await session.execute(stmt)
            media = result.scalar_one_or_none()
            if media:
                await session.delete(media)
                await session.commit()
            else:
                return None
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex


async def delete_media_permissions_by_media_id(
    async_session: AsyncSession, media_id: int
):
    try:
        async with async_session() as session:
            stmt = select(MediaPermission).where(MediaPermission.media_id == media_id)
            results = await session.execute(stmt)
            permissions = results.scalars().all()

            if permissions:
                for permission in permissions:
                    await session.delete(permission)
                await session.commit()
            else:
                return None
    except SQLAlchemyError as ex:
        await session.rollback()
        raise ex
