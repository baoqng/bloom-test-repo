# bloom-deps:

from typing import Union

Number = Union[int, float]


def clampToRange_0(value: Number, min_val: Number, max_val: Number) -> Number:
    """Clamp a number to an inclusive [min_val, max_val] range."""
    return max(min_val, min(value, max_val))