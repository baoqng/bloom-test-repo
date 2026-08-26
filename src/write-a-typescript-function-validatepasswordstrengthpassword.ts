// bloom-deps:

function validatePasswordStrength(
  password: unknown,
  minLength: unknown
): { valid: boolean; score: number; failures: string[] } {
  // Validate password type
  if (typeof password !== "string") {
    throw new TypeError("password must be a string");
  }

  // Validate minLength type and constraints
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

  // Apply all 5 checks simultaneously (no short-circuit)
  const failures: string[] = [];
  let score = 0;

  // Check 1: password length
  if (password.length < minLength) {
    failures.push(`password must be at least ${minLength} characters`);
  } else {
    score++;
  }

  // Check 2: uppercase letter (A-Z)
  if (!/[A-Z]/.test(password)) {
    failures.push("password must contain at least one uppercase letter");
  } else {
    score++;
  }

  // Check 3: lowercase letter (a-z)
  if (!/[a-z]/.test(password)) {
    failures.push("password must contain at least one lowercase letter");
  } else {
    score++;
  }

  // Check 4: digit (0-9)
  if (!/[0-9]/.test(password)) {
    failures.push("password must contain at least one digit");
  } else {
    score++;
  }

  // Check 5: special character from set !@#$%^&*()_+-=[]{}|;':",./<>?
  if (!/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password)) {
    failures.push("password must contain at least one special character");
  } else {
    score++;
  }

  const valid = failures.length === 0;

  return { valid, score, failures };
}

export { validatePasswordStrength };