import requests

num_requests = 100

success, failed = 0, 0


def main():
    global success, failed
    # The URL to your localhost endpoint
    url = "http://dev-fastapi-alb-1218099270.eu-central-1.elb.amazonaws.com:8080/v1/users/lisciowsky"
    # url = "http://localhost:8080/v1/users/lisciowsky"
    # url = "http://localhost:8080/v1/users/"

    for _ in range(num_requests):
        resp = requests.get(
            url=url,
            headers={
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2MDgwY2MzLTcxZmMtNGFmYy1hYTg3LTFhMzVlZmEwMGUzOSIsInVzZXJuYW1lIjoibGlzY2lvd3NreSIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzEwNTM3Mjg4fQ.7wGNdItapa0DvjdTIjpSLn7dfp_W4B4dyVIgRfL2c5Y"
            },
        )
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
