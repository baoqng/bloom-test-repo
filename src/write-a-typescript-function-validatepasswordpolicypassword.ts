// bloom-deps:

export interface ValidationResult {
  valid: boolean;
  violations: string[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isNonNegativeInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value >= 0;
}

export function validatePasswordPolicy(password: unknown, options: unknown): ValidationResult {
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }

  if (!isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }

  const optionsRecord = options as Record<string, unknown>;

  if ('minLength' in optionsRecord && !isNonNegativeInteger(optionsRecord.minLength)) {
    throw new TypeError('options.minLength must be a non-negative integer');
  }

  if ('maxLength' in optionsRecord && !isNonNegativeInteger(optionsRecord.maxLength)) {
    throw new TypeError('options.maxLength must be a non-negative integer');
  }

  if ('minUppercase' in optionsRecord && !isNonNegativeInteger(optionsRecord.minUppercase)) {
    throw new TypeError('options.minUppercase must be a non-negative integer');
  }

  if ('minDigits' in optionsRecord && !isNonNegativeInteger(optionsRecord.minDigits)) {
    throw new TypeError('options.minDigits must be a non-negative integer');
  }

  const minLength = 'minLength' in optionsRecord ? (optionsRecord.minLength as number) : 8;
  const maxLength = 'maxLength' in optionsRecord ? (optionsRecord.maxLength as number) : 128;
  const minUppercase = 'minUppercase' in optionsRecord ? (optionsRecord.minUppercase as number) : 1;
  const minDigits = 'minDigits' in optionsRecord ? (optionsRecord.minDigits as number) : 1;

  const violations: string[] = [];

  const passwordLength = password.length;
  const uppercaseCount = (password.match(/[A-Z]/g) ?? []).length;
  const digitCount = (password.match(/[0-9]/g) ?? []).length;

  if (Number.isFinite(minLength) && passwordLength < minLength) {
    violations.push(`Password must be at least ${minLength} characters long`);
  }

  if (Number.isFinite(maxLength) && passwordLength > maxLength) {
    violations.push(`Password must be at most ${maxLength} characters long`);
  }

  if (Number.isFinite(minUppercase) && uppercaseCount < minUppercase) {
    violations.push(`Password must contain at least ${minUppercase} uppercase letter(s)`);
  }

  if (Number.isFinite(minDigits) && digitCount < minDigits) {
    violations.push(`Password must contain at least ${minDigits} digit(s)`);
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}