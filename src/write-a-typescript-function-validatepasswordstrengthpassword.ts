// solution.ts

export function validatePasswordStrength(
  password: unknown,
  minLength: unknown
): { valid: boolean; score: number; failures: string[] } {
  // Validate password type
  if (typeof password !== "string") {
    throw new TypeError("password must be a string");
  }

  // Validate minLength type and value
  if (
    typeof minLength !== "number" ||
    !Number.isInteger(minLength) ||
    minLength <= 0 ||
    !Number.isFinite(minLength)
  ) {
    throw new TypeError("minLength must be a positive integer");
  }

  // Validate minLength range
  if (minLength > 128) {
    throw new RangeError("minLength must not exceed 128");
  }

  const failures: string[] = [];

  // Check 1: Length
  if (password.length < minLength) {
    failures.push(`password must be at least ${minLength} characters`);
  }

  // Check 2: Uppercase letter
  if (!/[A-Z]/.test(password)) {
    failures.push("password must contain at least one uppercase letter");
  }

  // Check 3: Lowercase letter
  if (!/[a-z]/.test(password)) {
    failures.push("password must contain at least one lowercase letter");
  }

  // Check 4: Digit
  if (!/[0-9]/.test(password)) {
    failures.push("password must contain at least one digit");
  }

  // Check 5: Special character
  if (!/[!@#$%^&*_\-?]/.test(password)) {
    failures.push("password must contain at least one special character");
  }

  const score = 5 - failures.length;
  const valid = failures.length === 0;

  return { valid, score, failures };
}