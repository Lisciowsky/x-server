from enum import Enum


class PermissionTypes(str, Enum):
    VIEW = "VIEW"
    EDIT = "EDIT"
    OWNER = "OWNER"
