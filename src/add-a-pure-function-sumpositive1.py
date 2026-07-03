# bloom-deps:

from typing import List


def sumPositive_1(numbers: List[float]) -> float:
    return sum(x for x in numbers if x > 0)