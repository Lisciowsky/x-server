import requests

num_requests = 20

success, failed = 0, 0


def main():
    global success, failed
    # The URL to your localhost endpoint
    # url = "http://localhost:8000/v1/users/lisciowsky"
    url = "https://d64ceqoxb7cb7f22tyeglu276m0ocqzt.lambda-url.eu-central-1.on.aws/v1/users/lisciowsky"
    for _ in range(num_requests):
        resp = requests.get(url=url)
        if resp != {"detail": "User not found"}:
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
