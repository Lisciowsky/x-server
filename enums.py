from enum import Enum


class Environment(str, Enum):
    TESTING = "TESTING"
    PRODUCTION = "PRODUCTION"
