# bloom-deps:

from typing import List, Union

def sumPositive_1(arr: List[Union[int, float]]) -> Union[int, float]:
    """
    Returns the sum of only the positive numbers in an array.
    
    Args:
        arr: A list of integers or floats
        
    Returns:
        The sum of all positive numbers in the array
    """
    return sum(num for num in arr if num > 0)