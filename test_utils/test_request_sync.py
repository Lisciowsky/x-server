import requests

num_requests = 10

success, failed = 0, 0


def main():
    global success, failed
    # The URL to your localhost endpoint
    url = "http://my-fastapi-alb-845491699.eu-central-1.elb.amazonaws.com:8080/v1/users/lisciowsky"
    # url = "http://localhost:8080/v1/users/lisciowsky"
    # url = "http://localhost:8080/v1/users/"

    for _ in range(num_requests):
        resp = requests.get(url=url)
        # resp = requests.post(
        #     url=url,
        #     json={
        #         "username": "lisciowsky",
        #         "password": "mialababakota",
        #         "fullname": "Jakub Szumlas",
        #         "email": "szumlas.kuba@gmail.com",
        #     },
        # )

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


# Run the main coroutine
if __name__ == "__main__":
    main()
    print(success, failed)
