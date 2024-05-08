import asyncpg
from sqlalchemy.engine.url import make_url


async def create_database_if_not_exists(url):
    db_url = make_url(url)
    default_db = "postgres"

    conn = await asyncpg.connect(
        user=db_url.username,
        password=db_url.password,
        host=db_url.host,
        port=db_url.port or 5432,
        database=default_db,
    )
    exists = await conn.fetchval(
        "SELECT EXISTS(SELECT FROM pg_database WHERE datname = $1)", db_url.database
    )

    if not exists:
        await conn.execute(f"CREATE DATABASE {db_url.database}")
        print(f"Database {db_url.database} created.")
    else:
        print(f"Database {db_url.database} already exists.")

    await conn.close()

    conn = await asyncpg.connect(
        user=db_url.username,
        password=db_url.password,
        host=db_url.host,
        port=db_url.port or 5432,
        database=db_url.database,
    )
    await conn.close()
