from datetime import datetime
from faker import Faker
import random
from sqlmodel import Session, create_engine

from db.models import Media, MediaPermission

fake = Faker()


def create_dummy_media(owner_username):
    media = Media(
        media_owner=owner_username,
        media_name=fake.file_name(category="video"),
        created_at=fake.date_time_this_year(),
        deleted_at=datetime(1, 1, 1),
        size_in_mb=random.uniform(0.5, 2000.0),
    )
    return media


def create_dummy_media_permission(media_id, username):
    permission_types = ["OWNER"]
    media_permission = MediaPermission(
        media_id=media_id,
        granted_to_username=username,
        permission_type=random.choice(permission_types),
        granted_at=fake.date_time_this_year(),
    )
    return media_permission


def insert_dummy_data(session, owner_username, num_media, num_permissions_per_media):
    for _ in range(num_media):
        media = create_dummy_media(owner_username)
        session.add(media)
        session.commit()

        for _ in range(num_permissions_per_media):
            permission = create_dummy_media_permission(media.id, owner_username)
            session.add(permission)
        session.commit()


engine = create_engine("postgresql+psycopg2://username:password@localhost/twitter_db")

with Session(engine) as session:
    owner_username = "lisciowsky"
    insert_dummy_data(session, owner_username, 10, 1)
