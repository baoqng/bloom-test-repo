// bloom-deps:

import * as fs from 'fs';
import * as path from 'path';

/**
 * Divides a by b and rounds to the nearest integer using banker's rounding
 * (round half to even). Exact halfway values (x.5) round to the nearest even integer.
 * 
 * @param a - the dividend
 * @param b - the divisor
 * @returns a / b rounded to nearest integer with ties going to even
 * @throws RangeError if b is 0
 * @throws TypeError if inputs are not valid numbers
 */
export function divideRoundEvenV15(a: number, b: number): number {
  // Type validation - must come before any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('divideRoundEvenV15: inputs must be numbers');
  }
  
  // Check for NaN or Infinity
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('divideRoundEvenV15: inputs must be finite numbers');
  }
  
  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }
  
  const quotient = a / b;
  const floor = Math.floor(quotient);
  const fractional = quotient - floor;
  
  // If fractional part is exactly 0.5, apply banker's rounding (round to even)
  if (fractional === 0.5) {
    // Round to the nearest even number
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // For all other cases, round to nearest integer using standard rounding
  return Math.round(quotient);
}

// Ensure src/utils.ts exists and has proper structure
const ensureUtilsFile = (): void => {
  const srcDir = path.join(process.cwd(), 'src');
  const utilsPath = path.join(srcDir, 'utils.ts');
  
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  if (!fs.existsSync(utilsPath)) {
    fs.writeFileSync(utilsPath, '', 'utf-8');
  }
};

// Initialize the file structure when module loads
try {
  ensureUtilsFile();
} catch (error) {
  // Silently handle file system errors during module initialization
  if (error instanceof Error) {
    console.error('Warning: Could not initialize utils.ts:', error.message);
  }
}