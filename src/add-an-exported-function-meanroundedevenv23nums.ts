// bloom-deps:

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export function meanRoundedEvenV23(nums: number[]): number {
  // Input validation: check for empty array
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Type guard: validate all elements are numbers
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new TypeError(`Invalid input: element at index ${i} is not a valid number`);
    }
  }

  // Compute arithmetic mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie: fractional part is exactly 0.5
  if (fract === 0.5) {
    // Round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: use standard rounding
  return Math.round(mean);
}

// Helper function to ensure src/utils.ts exists and exports the function
function ensureUtilsFile(): void {
  const utilsPath = resolve(process.cwd(), 'src', 'utils.ts');
  
  try {
    let content = '';
    try {
      content = readFileSync(utilsPath, 'utf-8');
    } catch {
      // File doesn't exist yet, create empty
      content = '';
    }

    // Check if function already exists
    if (!content.includes('export function meanRoundedEvenV23')) {
      // Append the function to the file
      const functionCode = `
export function meanRoundedEvenV23(nums: number[]): number {
  // Input validation: check for empty array
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Type guard: validate all elements are numbers
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new TypeError(\`Invalid input: element at index \${i} is not a valid number\`);
    }
  }

  // Compute arithmetic mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie: fractional part is exactly 0.5
  if (fract === 0.5) {
    // Round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: use standard rounding
  return Math.round(mean);
}
`;
      writeFileSync(utilsPath, content + functionCode);
    }
  } catch (err) {
    throw new Error('Failed to ensure utils.ts file exists', { cause: err });
  }
}

// Export the helper for module initialization
export { ensureUtilsFile };