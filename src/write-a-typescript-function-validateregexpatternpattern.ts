// bloom-deps:

export function validateRegexPattern(pattern: unknown, flags: unknown): RegExp {
  if (typeof pattern !== "string") {
    throw new TypeError("pattern must be a string");
  }

  if (pattern.length === 0) {
    throw new RangeError("pattern must not be empty");
  }

  if (typeof flags !== "string") {
    throw new TypeError("flags must be a string");
  }

  const validFlagChars = new Set(["d", "g", "i", "m", "s", "u", "v", "y"]);
  for (const char of flags) {
    if (!validFlagChars.has(char)) {
      throw new RangeError("flags must contain only valid regex flag characters");
    }
  }

  const flagCounts = new Map<string, number>();
  for (const char of flags) {
    flagCounts.set(char, (flagCounts.get(char) ?? 0) + 1);
  }
  for (const [, count] of flagCounts) {
    if (count > 1) {
      throw new RangeError("flags must not contain duplicate characters");
    }
  }

  if (flags.includes("u") && flags.includes("v")) {
    throw new RangeError("flags 'u' and 'v' cannot be combined");
  }

  try {
    return new RegExp(pattern, flags);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new RangeError(`pattern is not a valid regular expression: ${err.message}`);
    }
    throw err;
  }
}