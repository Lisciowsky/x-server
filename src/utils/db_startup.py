import asyncio
import asyncpg
from sqlalchemy.engine.url import make_url


async def create_database_if_not_exists(url):
    db_url = make_url(url)

    # Connect to the default database (postgres) to be able to create a new database
    default_db = "postgres"
    conn = await asyncpg.connect(
        user=db_url.username,
        password=db_url.password,
        host=db_url.host,
        port=db_url.port or 5432,
        database=default_db,
    )

    # Check if the database already exists
    exists = await conn.fetchval(
        "SELECT EXISTS(SELECT FROM pg_database WHERE datname = $1)", db_url.database
    )

    if not exists:
        # Database does not exist, create it
        await conn.execute(f"CREATE DATABASE {db_url.database}")
        print(f"Database {db_url.database} created.")
    else:
        print(f"Database {db_url.database} already exists.")

    await conn.close()

    # Now connect to the newly created database (if it was created) or the existing one
    conn = await asyncpg.connect(
        user=db_url.username,
        password=db_url.password,
        host=db_url.host,
        port=db_url.port or 5432,
        database=db_url.database,
    )
    # Use the connection...
    await conn.close()


# Example usage with your connection string
# asyncio.run(create_database_if_not_exists("postgresql+asyncpg://username:password@localhost/twitter_db"))
