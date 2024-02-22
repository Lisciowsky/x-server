import secrets
import string
import random


def generate_random_username():
    return "user_" + "".join(secrets.choice(string.ascii_letters) for _ in range(6))


def generate_random_email():
    domains = ["example.com", "mail.com", "test.org"]
    local_part = "".join(random.choices(string.ascii_letters + string.digits, k=10))
    return local_part + "@" + random.choice(domains)


def generate_random_full_name():
    first_names = ["John", "Jane", "Chris", "Sara", "Mike"]
    last_names = ["Doe", "Smith", "Brown", "Wilson", "Taylor"]
    return random.choice(first_names) + " " + random.choice(last_names)


def generate_random_password(length=32):
    password_characters = string.ascii_letters + string.digits + string.punctuation
    return "".join(secrets.choice(password_characters) for _ in range(length))
