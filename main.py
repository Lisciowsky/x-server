import uvicorn
from settings import SERVER_PORT, SERVER_HOST
from src.server import server  # for uvicorn Dockerfile.vps


def main():
    uvicorn.run(
        "src.server:server", host=SERVER_HOST, port=int(SERVER_PORT), reload=True
    )


if __name__ == "__main__":
    main()
