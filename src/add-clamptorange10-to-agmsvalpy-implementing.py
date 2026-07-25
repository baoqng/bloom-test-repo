# bloom-deps:
from typing import Union

Number = Union[int, float]


def clampToRange_10(value: Number, min_val: Number, max_val: Number) -> Number:
    """Clamps a number to an inclusive [min_val, max_val] range."""
    if value < min_val:
        return min_val
    if value > max_val:
        return max_val
    return value