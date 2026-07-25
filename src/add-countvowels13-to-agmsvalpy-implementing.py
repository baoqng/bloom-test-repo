# bloom-deps:

def countVowels_13(s: str) -> int:
    vowels = set("aeiou")
    return sum(1 for c in s if c in vowels)