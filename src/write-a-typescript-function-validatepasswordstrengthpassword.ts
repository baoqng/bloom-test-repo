// bloom-deps:

function validatePasswordStrength(
  password: unknown,
  minLength: unknown
): { valid: boolean; score: number; failures: string[] } {
  if (typeof password !== "string") {
    throw new TypeError("password must be a string");
  }

  if (
    typeof minLength !== "number" ||
    !Number.isFinite(minLength) ||
    !Number.isInteger(minLength) ||
    minLength <= 0
  ) {
    throw new TypeError("minLength must be a positive integer");
  }

  if (minLength > 128) {
    throw new RangeError("minLength must not exceed 128");
  }

  const failures: string[] = [];

  // Check 1: length
  if (password.length < minLength) {
    failures.push(`password must be at least ${minLength} characters`);
  }

  // Check 2: uppercase
  if (!/[A-Z]/.test(password)) {
    failures.push("password must contain at least one uppercase letter");
  }

  // Check 3: lowercase
  if (!/[a-z]/.test(password)) {
    failures.push("password must contain at least one lowercase letter");
  }

  // Check 4: digit
  if (!/[0-9]/.test(password)) {
    failures.push("password must contain at least one digit");
  }

  // Check 5: special character from the set !@#$%^&*()_+-=[]{}|;':",./<>?
  if (!/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password)) {
    failures.push("password must contain at least one special character");
  }

  const score = 5 - failures.length;
  const valid = failures.length === 0;

  return { valid, score, failures };
}

export { validatePasswordStrength };