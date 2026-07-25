# bloom-deps:

def countVowels_3(s: str) -> int:
    return sum(1 for c in s if c in 'aeiou')