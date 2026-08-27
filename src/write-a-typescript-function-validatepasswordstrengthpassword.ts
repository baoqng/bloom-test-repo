// bloom-deps:
import { describe, it, expect } from 'vitest';

// Inline implementation for testing
function validatePasswordStrength(
  password: unknown,
  minLength: unknown
): { valid: boolean; score: number; failures: string[] } {
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }
  if (
    typeof minLength !== 'number' ||
    !Number.isFinite(minLength) ||
    !Number.isInteger(minLength) ||
    minLength <= 0
  ) {
    throw new TypeError('minLength must be a positive integer');
  }
  if (minLength > 128) {
    throw new RangeError('minLength must not exceed 128');
  }

  const failures: string[] = [];

  // Check 1: length
  if (password.length < minLength) {
    failures.push(`password must be at least ${minLength} characters`);
  }

  // Check 2: uppercase
  if (!/[A-Z]/.test(password)) {
    failures.push('password must contain at least one uppercase letter');
  }

  // Check 3: lowercase
  if (!/[a-z]/.test(password)) {
    failures.push('password must contain at least one lowercase letter');
  }

  // Check 4: digit
  if (!/[0-9]/.test(password)) {
    failures.push('password must contain at least one digit');
  }

  // Check 5: special character
  if (!/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password)) {
    failures.push('password must contain at least one special character');
  }

  const score = 5 - failures.length;
  const valid = failures.length === 0;

  return { valid, score, failures };
}

describe('validatePasswordStrength', () => {
  // TypeError for invalid password type
  describe('password type validation', () => {
    it('throws TypeError when password is null', () => {
      expect(() => validatePasswordStrength(null, 8)).toThrow(TypeError);
      expect(() => validatePasswordStrength(null, 8)).toThrow('password must be a string');
    });

    it('throws TypeError when password is undefined', () => {
      expect(() => validatePasswordStrength(undefined, 8)).toThrow(TypeError);
      expect(() => validatePasswordStrength(undefined, 8)).toThrow('password must be a string');
    });

    it('throws TypeError when password is a number', () => {
      expect(() => validatePasswordStrength(123, 8)).toThrow(TypeError);
      expect(() => validatePasswordStrength(123, 8)).toThrow('password must be a string');
    });

    it('throws TypeError when password is a boolean', () => {
      expect(() => validatePasswordStrength(true, 8)).toThrow(TypeError);
      expect(() => validatePasswordStrength(true, 8)).toThrow('password must be a string');
    });

    it('throws TypeError when password is an object', () => {
      expect(() => validatePasswordStrength({}, 8)).toThrow(TypeError);
      expect(() => validatePasswordStrength({}, 8)).toThrow('password must be a string');
    });

    it('throws TypeError when password is an array', () => {
      expect(() => validatePasswordStrength([], 8)).toThrow(TypeError);
      expect(() => validatePasswordStrength([], 8)).toThrow('password must be a string');
    });
  });

  // TypeError for invalid minLength
  describe('minLength type validation', () => {
    it('throws TypeError when minLength is not a number', () => {
      expect(() => validatePasswordStrength('Password1!', '8')).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', '8')).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is null', () => {
      expect(() => validatePasswordStrength('Password1!', null)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', null)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is undefined', () => {
      expect(() => validatePasswordStrength('Password1!', undefined)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', undefined)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is NaN', () => {
      expect(() => validatePasswordStrength('Password1!', NaN)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', NaN)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is Infinity', () => {
      expect(() => validatePasswordStrength('Password1!', Infinity)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', Infinity)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is -Infinity', () => {
      expect(() => validatePasswordStrength('Password1!', -Infinity)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', -Infinity)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is a float', () => {
      expect(() => validatePasswordStrength('Password1!', 8.5)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', 8.5)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is zero', () => {
      expect(() => validatePasswordStrength('Password1!', 0)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', 0)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is negative', () => {
      expect(() => validatePasswordStrength('Password1!', -1)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', -1)).toThrow('minLength must be a positive integer');
    });

    it('throws TypeError when minLength is a boolean', () => {
      expect(() => validatePasswordStrength('Password1!', true)).toThrow(TypeError);
      expect(() => validatePasswordStrength('Password1!', true)).toThrow('minLength must be a positive integer');
    });
  });

  // RangeError when minLength > 128
  describe('minLength range validation', () => {
    it('throws RangeError when minLength is 129', () => {
      expect(() => validatePasswordStrength('Password1!', 129)).toThrow(RangeError);
      expect(() => validatePasswordStrength('Password1!', 129)).toThrow('minLength must not exceed 128');
    });

    it('throws RangeError when minLength is 200', () => {
      expect(() => validatePasswordStrength('Password1!', 200)).toThrow(RangeError);
      expect(() => validatePasswordStrength('Password1!', 200)).toThrow('minLength must not exceed 128');
    });

    it('does not throw RangeError when minLength is exactly 128', () => {
      const pwd = 'Aa1!'.repeat(32); // 128 chars
      expect(() => validatePasswordStrength(pwd, 128)).not.toThrow();
    });

    it('does not throw RangeError when minLength is 1', () => {
      expect(() => validatePasswordStrength('A', 1)).not.toThrow();
    });
  });

  // All checks pass
  describe('all checks passed', () => {
    it('returns { valid: true, score: 5, failures: [] } for a fully valid password', () => {
      const result = validatePasswordStrength('Password1!', 8);
      expect(result).toEqual({ valid: true, score: 5, failures: [] });
    });

    it('returns valid=true and score=5 for a strong password meeting minLength exactly', () => {
      const result = validatePasswordStrength('Abcdef1!', 8);
      expect(result.valid).toBe(true);
      expect(result.score).toBe(5);
      expect(result.failures).toHaveLength(0);
    });

    it('returns valid=true when all special characters are present among others', () => {
      const result = validatePasswordStrength('Aa1!@#$%', 8);
      expect(result.valid).toBe(true);
      expect(result.score).toBe(5);
      expect(result.failures).toEqual([]);
    });
  });

  // Check 1: length
  describe('check 1 - password length', () => {
    it('fails when password is shorter than minLength', () => {
      const result = validatePasswordStrength('Aa1!', 8);
      expect(result.failures).toContain('password must be at least 8 characters');
    });

    it('failure message interpolates minLength correctly', () => {
      const result = validatePasswordStrength('Aa1!', 10);
      expect(result.failures).toContain('password must be at least 10 characters');
    });

    it('passes length check when password.length equals minLength', () => {
      const result = validatePasswordStrength('Abcdef1!', 8);
      expect(result.failures).not.toContain('password must be at least 8 characters');
    });

    it('passes length check when password.length exceeds minLength', () => {
      const result = validatePasswordStrength('Abcdefghij1!', 8);
      expect(result.failures).not.toContain('password must be at least 8 characters');
    });

    it('decrements score when length check fails', () => {
      const result = validatePasswordStrength('Aa1!', 8);
      // fails length; passes uppercase, lowercase, digit, special
      expect(result.score).toBe(4);
    });
  });

  // Check 2: uppercase
  describe('check 2 - uppercase letter', () => {
    it('fails when password has no uppercase letter', () => {
      const result = validatePasswordStrength('password1!', 8);
      expect(result.failures).toContain('password must contain at least one uppercase letter');
    });

    it('passes when password has at least one uppercase letter', () => {
      const result = validatePasswordStrength('Password1!', 8);
      expect(result.failures).not.toContain('password must contain at least one uppercase letter');
    });

    it('decrements score when uppercase check fails', () => {
      const result = validatePasswordStrength('password1!', 8);
      expect(result.score).toBe(4);
    });
  });

  // Check 3: lowercase
  describe('check 3 - lowercase letter', () => {
    it('fails when password has no lowercase letter', () => {
      const result = validatePasswordStrength('PASSWORD1!', 8);
      expect(result.failures).toContain('password must contain at least one lowercase letter');
    });

    it('passes when password has at least one lowercase letter', () => {
      const result = validatePasswordStrength('Password1!', 8);
      expect(result.failures).not.toContain('password must contain at least one lowercase letter');
    });

    it('decrements score when lowercase check fails', () => {
      const result = validatePasswordStrength('PASSWORD1!', 8);
      expect(result.score).toBe(4);
    });
  });

  // Check 4: digit
  describe('check 4 - digit', () => {
    it('fails when password has no digit', () => {
      const result = validatePasswordStrength('Password!!', 8);
      expect(result.failures).toContain('password must contain at least one digit');
    });

    it('passes when password has at least one digit', () => {
      const result = validatePasswordStrength('Password1!', 8);
      expect(result.failures).not.toContain('password must contain at least one digit');
    });

    it('decrements score when digit check fails', () => {
      const result = validatePasswordStrength('Password!!', 8);
      expect(result.score).toBe(4);
    });
  });

  // Check 5: special character
  describe('check 5 - special character', () => {
    it('fails when password has no special character', () => {
      const result = validatePasswordStrength('Password1a', 8);
      expect(result.failures).toContain('password must contain at least one special character');
    });

    it('passes with ! as special character', () => {
      const result = validatePasswordStrength('Password1!', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with @ as special character', () => {
      const result = validatePasswordStrength('Password1@', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with # as special character', () => {
      const result = validatePasswordStrength('Password1#', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with $ as special character', () => {
      const result = validatePasswordStrength('Password1$', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with % as special character', () => {
      const result = validatePasswordStrength('Password1%', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with ^ as special character', () => {
      const result = validatePasswordStrength('Password1^', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with & as special character', () => {
      const result = validatePasswordStrength('Password1&', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with * as special character', () => {
      const result = validatePasswordStrength('Password1*', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with ( as special character', () => {
      const result = validatePasswordStrength('Password1(', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with ) as special character', () => {
      const result = validatePasswordStrength('Password1)', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with _ as special character', () => {
      const result = validatePasswordStrength('Password1_', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it("passes with + as special character", () => {
      const result = validatePasswordStrength('Password1+', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with - as special character', () => {
      const result = validatePasswordStrength('Password1-', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with = as special character', () => {
      const result = validatePasswordStrength('Password1=', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with [ as special character', () => {
      const result = validatePasswordStrength('Password1[', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with ] as special character', () => {
      const result = validatePasswordStrength('Password1]', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with { as special character', () => {
      const result = validatePasswordStrength('Password1{', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with } as special character', () => {
      const result = validatePasswordStrength('Password1}', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with | as special character', () => {
      const result = validatePasswordStrength('Password1|', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it("passes with ; as special character", () => {
      const result = validatePasswordStrength('Password1;', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it("passes with ' as special character", () => {
      const result = validatePasswordStrength("Password1'", 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with : as special character', () => {
      const result = validatePasswordStrength('Password1:', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with " as special character', () => {
      const result = validatePasswordStrength('Password1"', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with , as special character', () => {
      const result = validatePasswordStrength('Password1,', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with . as special character', () => {
      const result = validatePasswordStrength('Password1.', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with / as special character', () => {
      const result = validatePasswordStrength('Password1/', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with < as special character', () => {
      const result = validatePasswordStrength('Password1<', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with > as special character', () => {
      const result = validatePasswordStrength('Password1>', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('passes with ? as special character', () => {
      const result = validatePasswordStrength('Password1?', 8);
      expect(result.failures).not.toContain('password must contain at least one special character');
    });

    it('decrements score when special character check fails', () => {
      const result = validatePasswordStrength('Password1a', 8);
      expect(result.score).toBe(4);
    });
  });

  // Non-short-circuit: collect all failures
  describe('non-short-circuit behavior', () => {
    it('collects multiple failures simultaneously', () => {
      // no uppercase, no digit, no special char, too short
      const result = validatePasswordStrength('abc', 8);
      expect(result.failures).toContain('password must be at least 8 characters');
      expect(result.failures).toContain('password must contain at least one uppercase letter');
      expect(result.failures).toContain('password must contain at least one digit');
      expect(result.failures).toContain('password must contain at least one special character');
    });

    it('collects all 5 failures when password is empty string and minLength is 8', () => {
      const result = validatePasswordStrength('', 8);
      expect(result.failures).toHaveLength(5);
      expect(result.score).toBe(0);
      expect(result.valid).toBe(false);
      expect(result.failures).toContain('password must be at least 8 characters');
      expect(result.failures).toContain('password must contain at least one uppercase letter');
      expect(result.failures).toContain('password must contain at least one lowercase letter');
      expect(result.failures).toContain('password must contain at least one digit');
      expect(result.failures).toContain('password must contain at least one special character');
    });

    it('returns score 0 and valid false when all 5 checks fail', () => {
      const result = validatePasswordStrength('', 8);
      expect(result.score).toBe(0);
      expect(result.valid).toBe(false);
    });

    it('collects 2 failures when 2 checks fail', () => {
      // has uppercase, has lowercase, has digit, but no special, too short
      const result = validatePasswordStrength('Abc1', 8);
      expect(result.failures).toHaveLength(2);
      expect(result.score).toBe(3);
    });

    it('does not throw for password content failures', () => {
      expect(() => validatePasswordStrength('weakpassword', 8)).not.toThrow();
    });

    it('returns result object even when all checks fail', () => {
      const result = validatePasswordStrength('', 1);
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('failures');
    });
  });

  // Score calculation
  describe('score calculation', () => {
    it('score equals number of checks passed', () => {
      // all 5 pass
      const result5 = validatePasswordStrength('Password1!', 8);
      expect(result5.score).toBe(5);

      // 4 pass (missing uppercase)
      const result4 = validatePasswordStrength('password1!', 8);
      expect(result4.score).toBe(4);

      // 3 pass (missing uppercase, lowercase)
      const result3 = validatePasswordStrength('PASSWORD1!', 8);
      // has uppercase, missing lowercase
      expect(result3.score).toBe(4);
    });

    it('score is 0 when all checks fail', () => {
      const result = validatePasswordStrength('', 8);
      expect(result.score).toBe(0);
    });

    it('score is 5 when all checks pass', () => {
      const result = validatePasswordStrength('StrongPass1!', 8);
      expect(result.score).toBe(5);
    });

    it('score equals 5 minus failures length', () => {
      const result = validatePasswordStrength('password1!', 8);
      expect(result.score).toBe(5 - result.failures.length);
    });
  });

  // valid field
  describe('valid field', () => {
    it('valid is true when failures is empty', () => {
      const result = validatePasswordStrength('Password1!', 8);
      expect(result.valid).toBe(true);
      expect(result.failures).toHaveLength(0);
    });

    it('valid is false when there are failures', () => {
      const result = validatePasswordStrength('password', 8);
      expect(result.valid).toBe(false);
      expect(result.failures.length).toBeGreaterThan(0);
    });

    it('valid is false for empty password', () => {
      const result = validatePasswordStrength('', 1);
      expect(result.valid).toBe(false);
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it