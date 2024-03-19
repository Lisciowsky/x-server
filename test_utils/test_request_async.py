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
        # Assuming you don't need the response content, we won't wait for it.
        # If you do need to process the response, you might want to wait for it here.
        resp = await response.json()
        # if resp != {
        #     "username": "lisciowsky",
        #     "fullname": "Jakub Szumlas",
        #     "email": "szumlas.kuba@gmail.com",
        #     "role": "user",
        # }:
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

    # Number of times you want to call the endpoint

    # Create a session that can be used for all requests
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for _ in range(num_requests)]
        # Schedule the tasks but do not explicitly wait for each to finish
        await asyncio.gather(*tasks)


# Run the main coroutine
if __name__ == "__main__":
    asyncio.run(main())
    print(success, failed)
