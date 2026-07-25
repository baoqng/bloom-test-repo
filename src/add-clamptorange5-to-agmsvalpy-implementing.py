# bloom-deps:
from typing import Union

Number = Union[int, float]


def clampToRange_5(value: Number, min_val: Number, max_val: Number) -> Number:
    if value < min_val:
        return min_val
    if value > max_val:
        return max_val
    return value