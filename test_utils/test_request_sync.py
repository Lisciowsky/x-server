import requests
from time import perf_counter

num_requests = 50

success, failed = 0, 0


def main():
    global success, failed
    # The URL to your localhost endpoint
    # url = "http://dev-fastapi-alb-1218099270.eu-central-1.elb.amazonaws.com:8080/v1/users/lisciowsky"
    url = "http://localhost:8080/v1/users/lisciowsky"
    # url = "http://localhost:8080/v1/users/"

    start = perf_counter()

    for _ in range(num_requests):
        resp = requests.get(
            url=url,
            cookies={
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjYjM0ZGMzLWViNjAtNGQ1ZS1hZDIwLTJiNjAxMWY4NzI4MSIsInVzZXJuYW1lIjoibGlzY2lvd3NreSIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzExNDkwMDg5fQ.VdQobtudhpIZ5kjZj3EKCkS0fPYgnAHvbYnQLUHf9G4"
            },
        )
        if resp.status_code != 200:
            print("----")
            print(resp)
            print("----")
            failed += 1
        else:
            print("----")
            print("Success")
            print("----")
            success += 1
    end = perf_counter()
    elapsed = end - start

    print(round(elapsed, 2))


if __name__ == "__main__":
    main()
    print(success, failed)
