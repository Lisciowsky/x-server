from mangum import Mangum
from src.server import server

handler = Mangum(app=server, lifespan="off")
