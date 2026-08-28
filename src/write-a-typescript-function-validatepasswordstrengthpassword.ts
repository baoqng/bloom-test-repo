// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) {
    return false;
  }
  return true;
}

function validatePasswordStrength(
  password: unknown,
  options: unknown
): { valid: boolean; score: number; violations: string[] } {
  // Validate password type
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }

  // Set default options
  const defaults = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireDigit: true,
    requireSpecial: false,
  };

  // Validate options type if provided
  let opts = defaults;
  if (options !== undefined) {
    if (!isPlainObject(options)) {
      throw new TypeError('options must be a plain object');
    }
    opts = {
      minLength:
        typeof (options as Record<string, unknown>).minLength === 'number' &&
        (options as Record<string, unknown>).minLength > 0
          ? (options as Record<string, unknown>).minLength
          : defaults.minLength,
      requireUppercase:
        typeof (options as Record<string, unknown>).requireUppercase ===
        'boolean'
          ? (options as Record<string, unknown>).requireUppercase
          : defaults.requireUppercase,
      requireLowercase:
        typeof (options as Record<string, unknown>).requireLowercase ===
        'boolean'
          ? (options as Record<string, unknown>).requireLowercase
          : defaults.requireLowercase,
      requireDigit:
        typeof (options as Record<string, unknown>).requireDigit === 'boolean'
          ? (options as Record<string, unknown>).requireDigit
          : defaults.requireDigit,
      requireSpecial:
        typeof (options as Record<string, unknown>).requireSpecial ===
        'boolean'
          ? (options as Record<string, unknown>).requireSpecial
          : defaults.requireSpecial,
    };
  }

  let score = 0;
  const violations: string[] = [];

  // Check length
  if (password.length < opts.minLength) {
    violations.push(
      `Password must be at least ${opts.minLength} characters long`
    );
  } else {
    score++;
  }

  // Check uppercase
  if (opts.requireUppercase) {
    if (!/[A-Z]/.test(password)) {
      violations.push('Password must contain at least one uppercase letter');
    } else {
      score++;
    }
  }

  // Check lowercase
  if (opts.requireLowercase) {
    if (!/[a-z]/.test(password)) {
      violations.push('Password must contain at least one lowercase letter');
    } else {
      score++;
    }
  }

  // Check digit
  if (opts.requireDigit) {
    if (!/[0-9]/.test(password)) {
      violations.push('Password must contain at least one digit');
    } else {
      score++;
    }
  }

  // Check special characters
  if (opts.requireSpecial) {
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      violations.push('Password must contain at least one special character');
    } else {
      score++;
    }
  }

  return {
    valid: violations.length === 0,
    score,
    violations,
  };
}

export { validatePasswordStrength };