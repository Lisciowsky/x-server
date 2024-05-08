import requests
from faker import Faker

# Initialize Faker to generate dummy data
fake = Faker()


def create_user():
    """Generate a dummy user payload."""
    return {
        "username": fake.user_name(),
        "password": fake.password(),
        "fullname": fake.name(),
        "email": fake.email(),
    }


def send_post_requests(n, url):
    """Send n POST requests to the specified URL with generated user data."""
    for _ in range(n):
        payload = create_user()
        response = requests.post(url, json=payload)
        if response.status_code == 201:
            print(f"User created successfully: {payload['username']}")
        else:
            print(f"Failed to create user: {response.text}")


# URL to send POST requests to
url = "http://localhost:8080/v1/users/"
# url = "http://dev-fastapi-alb-1218099270.eu-central-1.elb.amazonaws.com:8080/v1/users"

# Number of users to create
n = 30

send_post_requests(n, url)
