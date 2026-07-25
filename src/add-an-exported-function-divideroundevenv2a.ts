// bloom-deps:

import fs from 'fs';
import path from 'path';

/**
 * Divides a by b and rounds to the nearest integer.
 * Exact halves (e.g., 2.5, 3.5) round to the nearest EVEN integer.
 * Non-half fractions use standard nearest rounding.
 *
 * Examples:
 * - divideRoundEvenV2(5, 2) === 2  (2.5 → even)
 * - divideRoundEvenV2(7, 2) === 4  (3.5 → even)
 * - divideRoundEvenV2(9, 2) === 4  (4.5 → even)
 * - divideRoundEvenV2(-5, 2) === -2  (-2.5 → even)
 * - divideRoundEvenV2(1, 3) === 0  (0.333... → nearest)
 *
 * @param a - numerator
 * @param b - denominator
 * @returns a / b rounded according to banker's rounding (round half to even)
 * @throws {TypeError} if inputs are not numeric
 * @throws {RangeError} if b is 0
 */
export function divideRoundEvenV2(a: number, b: number): number {
  // Type validation: reject non-numeric or wrong-type inputs
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('divideRoundEvenV2 requires numeric arguments');
  }

  // Check for NaN
  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new TypeError('divideRoundEvenV2 requires numeric arguments');
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform division
  const quotient = a / b;

  // Use Math.round with banker's rounding (round half to even)
  // In JavaScript, Math.round does NOT do banker's rounding natively,
  // so we implement it explicitly
  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  // If fractional part is exactly 0.5, round to nearest even
  if (fract === 0.5) {
    // floor is even, round down to floor
    if (floor % 2 === 0) {
      return floor;
    }
    // floor is odd, round up to floor + 1
    return floor + 1;
  }

  // Otherwise use standard rounding (nearest)
  return Math.round(quotient);
}

// Ensure src/utils.ts file exists and is writable
const utilsPath = path.join(process.cwd(), 'src', 'utils.ts');
const dir = path.dirname(utilsPath);

try {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Only write if file doesn't exist or append to it
  if (!fs.existsSync(utilsPath)) {
    fs.writeFileSync(
      utilsPath,
      `// bloom-deps:\n\nexport function divideRoundEvenV2(a: number, b: number): number {\n  // Type validation: reject non-numeric or wrong-type inputs\n  if (typeof a !== 'number' || typeof b !== 'number') {\n    throw new TypeError('divideRoundEvenV2 requires numeric arguments');\n  }\n\n  // Check for NaN\n  if (Number.isNaN(a) || Number.isNaN(b)) {\n    throw new TypeError('divideRoundEvenV2 requires numeric arguments');\n  }\n\n  // Division by zero check\n  if (b === 0) {\n    throw new RangeError('division by zero');\n  }\n\n  // Perform division\n  const quotient = a / b;\n\n  // Use Math.round with banker's rounding (round half to even)\n  // In JavaScript, Math.round does NOT do banker's rounding natively,\n  // so we implement it explicitly\n  const floor = Math.floor(quotient);\n  const fract = quotient - floor;\n\n  // If fractional part is exactly 0.5, round to nearest even\n  if (fract === 0.5) {\n    // floor is even, round down to floor\n    if (floor % 2 === 0) {\n      return floor;\n    }\n    // floor is odd, round up to floor + 1\n    return floor + 1;\n  }\n\n  // Otherwise use standard rounding (nearest)\n  return Math.round(quotient);\n}\n`,
      'utf-8'
    );
  }
} catch (error) {
  console.error('Failed to write utils.ts:', error);
  throw error;
}