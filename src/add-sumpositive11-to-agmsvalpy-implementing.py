# bloom-deps:

from typing import List


def sumPositive_11(numbers: List[float]) -> float:
    return sum(n for n in numbers if n > 0)