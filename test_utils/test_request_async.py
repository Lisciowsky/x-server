import aiohttp
import asyncio

num_requests = 10
success, failed = 0, 0


async def fetch(session, url):
    global success, failed
    async with session.get(url) as response:
        # Assuming you don't need the response content, we won't wait for it.
        # If you do need to process the response, you might want to wait for it here.
        resp = await response.json()
        if resp != {
            "username": "lisciowsky",
            "fullname": "Jakub Szumlas",
            "email": "szumlas.kuba@gmail.com",
        }:
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
    # url = "http://my-fastapi-alb-845491699.eu-central-1.elb.amazonaws.com:8080/v1/users/lisciowsky"
    url = "http://localhost:8080/v1/users/lisciowsky"

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
