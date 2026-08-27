// bloom-deps:

export function validatePasswordStrength(
  password: unknown,
  minLength: unknown
): { valid: boolean; score: number; failures: string[] } {
  // Type validation for password
  if (typeof password !== "string") {
    throw new TypeError("password must be a string");
  }

  // Type validation for minLength
  if (
    typeof minLength !== "number" ||
    !Number.isFinite(minLength) ||
    !Number.isInteger(minLength) ||
    minLength <= 0
  ) {
    throw new TypeError("minLength must be a positive integer");
  }

  // Range validation for minLength
  if (minLength > 128) {
    throw new RangeError("minLength must not exceed 128");
  }

  // Collect all failures without short-circuiting
  const failures: string[] = [];

  // Check 1: password length
  if (password.length < minLength) {
    failures.push(`password must be at least ${minLength} characters`);
  }

  // Check 2: uppercase letter (A-Z)
  if (!/[A-Z]/.test(password)) {
    failures.push("password must contain at least one uppercase letter");
  }

  // Check 3: lowercase letter (a-z)
  if (!/[a-z]/.test(password)) {
    failures.push("password must contain at least one lowercase letter");
  }

  // Check 4: digit (0-9)
  if (!/[0-9]/.test(password)) {
    failures.push("password must contain at least one digit");
  }

  // Check 5: special character from the set !@#$%^&*()_+-=[]{}|;':",./<>?
  if (!/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password)) {
    failures.push("password must contain at least one special character");
  }

  // Calculate score: number of checks passed (5 total checks)
  const score = 5 - failures.length;

  // Determine validity
  const valid = failures.length === 0;

  return { valid, score, failures };
}