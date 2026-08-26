// bloom-deps:

function validateCronPattern(expr: unknown): string {
  if (typeof expr !== "string") {
    throw new TypeError("expr must be a string");
  }

  if (expr.trim().length === 0) {
    throw new RangeError("expr must not be empty");
  }

  const trimmed = expr.trim();
  const fields = trimmed.split(/\s+/);

  if (fields.length !== 5) {
    throw new RangeError("cron expression must have exactly 5 fields");
  }

  // Field definitions: [min, max]
  const fieldRanges: [number, number][] = [
    [0, 59],   // minute
    [0, 23],   // hour
    [1, 31],   // day-of-month
    [1, 12],   // month
    [0, 7],    // day-of-week
  ];

  function isIntegerString(s: string): boolean {
    return /^-?\d+$/.test(s);
  }

  function parseInteger(s: string): number | null {
    if (!isIntegerString(s)) return null;
    return parseInt(s, 10);
  }

  for (let i = 0; i < 5; i++) {
    const field = fields[i];
    const [min, max] = fieldRanges[i];
    let valid = false;

    if (field === "*") {
      // Any value
      valid = true;
    } else if (field.startsWith("*/")) {
      // Step: */N
      const stepStr = field.slice(2);
      const step = parseInteger(stepStr);
      if (step !== null && step >= 1 && step <= max) {
        valid = true;
      }
    } else if (field.includes("-")) {
      // Range: N-M
      const dashIndex = field.indexOf("-");
      // Handle negative numbers: only split on dash that's not at start
      // We need to find the range separator dash
      // A range is N-M where N and M are integers
      // Let's try to split properly
      const parts = field.split("-");
      // Could be: "5-10" -> ["5", "10"]
      // Could be: "-1-5" which shouldn't be valid as cron fields are non-negative
      if (parts.length === 2) {
        const nStr = parts[0];
        const mStr = parts[1];
        const n = parseInteger(nStr);
        const m = parseInteger(mStr);
        if (
          n !== null &&
          m !== null &&
          n >= min &&
          n <= max &&
          m >= min &&
          m <= max &&
          n <= m
        ) {
          valid = true;
        }
      }
    } else {
      // Literal integer
      const val = parseInteger(field);
      if (val !== null && val >= min && val <= max) {
        valid = true;
      }
    }

    if (!valid) {
      throw new RangeError(`invalid cron field ${i + 1}: ${field}`);
    }
  }

  return trimmed;
}

export { validateCronPattern };