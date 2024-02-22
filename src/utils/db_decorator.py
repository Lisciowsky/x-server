from typing import Callable
from sqlalchemy.exc import SQLAlchemyError


def rollback_decorator(fn: Callable):

    def inner(*args, **kwargs):
        try:
            result = fn(*args, **kwargs)
        except SQLAlchemyError:
            pass

    return inner
