import aiohttp
import asyncio

num_requests = 101
success, failed = 0, 0


async def fetch(session, url):
    global success, failed
    async with session.get(
        url,
        headers={
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2MDgwY2MzLTcxZmMtNGFmYy1hYTg3LTFhMzVlZmEwMGUzOSIsInVzZXJuYW1lIjoibGlzY2lvd3NreSIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzEwNTM3Mjg4fQ.7wGNdItapa0DvjdTIjpSLn7dfp_W4B4dyVIgRfL2c5Y"
        },
    ) as response:
        resp = await response.json()
        if resp != {"status": "healthy"}:
            print("----")
            print(resp)
            print("----")
            failed += 1
        else:
            print("----")
            print("Success")
            print("----")
            success += 1


async def main():
    # The URL to your localhost endpoint
    url = "http://dev-fastapi-alb-1218099270.eu-central-1.elb.amazonaws.com:8080/v1/users/lisciowsky"
    # url = "http://localhost:8080/v1/users/lisciowsky"
    # url = "http://localhost:8080/healthcheck"

    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for _ in range(num_requests)]
        await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
    print(success, failed)
