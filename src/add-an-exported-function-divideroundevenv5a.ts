// bloom-deps:

import * as fs from "fs";
import * as path from "path";

/**
 * Divides a by b and rounds to nearest integer.
 * Exact halves (fractional part === 0.5) round to the nearest EVEN integer.
 * Non-half fractions use standard nearest rounding.
 *
 * @param a - dividend
 * @param b - divisor
 * @returns a / b rounded according to banker's rounding (round-to-even)
 * @throws {TypeError} if a or b is not a number
 * @throws {RangeError} if b is 0
 */
export function divideRoundEvenV5(a: number, b: number): number {
  // Type validation guard (must fire BEFORE any arithmetic)
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError(
      `divideRoundEvenV5: expected (number, number), got (${typeof a}, ${typeof b})`
    );
  }

  // Check for NaN and Infinity
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError(
      `divideRoundEvenV5: inputs must be finite numbers`
    );
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError("division by zero");
  }

  // Compute the quotient
  const quotient = a / b;

  // Get the integer and fractional parts
  const integerPart = Math.trunc(quotient);
  const fractionalPart = quotient - integerPart;

  // If fractional part is exactly 0.5 (or -0.5 for negative), apply banker's rounding
  if (fractionalPart === 0.5) {
    // Round to the nearest even integer
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  } else if (fractionalPart === -0.5) {
    // For negative fractional parts, round to nearest even in the negative direction
    return integerPart % 2 === 0 ? integerPart : integerPart - 1;
  }

  // For non-half fractions, use standard rounding (Math.round)
  return Math.round(quotient);
}

// Ensure src/utils.ts exists and export the function
async function ensureUtilsFileExists(): Promise<void> {
  const srcDir = path.join(process.cwd(), "src");
  const utilsFilePath = path.join(srcDir, "utils.ts");

  try {
    // Check if src directory exists, if not create it
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }

    // Read existing file if it exists
    let existingContent = "";
    if (fs.existsSync(utilsFilePath)) {
      existingContent = fs.readFileSync(utilsFilePath, "utf-8");
    }

    // Check if divideRoundEvenV5 is already exported
    if (!existingContent.includes("export function divideRoundEvenV5")) {
      // Append the function if it doesn't exist
      const functionCode = `
/**
 * Divides a by b and rounds to nearest integer.
 * Exact halves (fractional part === 0.5) round to the nearest EVEN integer.
 * Non-half fractions use standard nearest rounding.
 *
 * @param a - dividend
 * @param b - divisor
 * @returns a / b rounded according to banker's rounding (round-to-even)
 * @throws {TypeError} if a or b is not a number
 * @throws {RangeError} if b is 0
 */
export function divideRoundEvenV5(a: number, b: number): number {
  // Type validation guard (must fire BEFORE any arithmetic)
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError(
      \`divideRoundEvenV5: expected (number, number), got (\${typeof a}, \${typeof b})\`
    );
  }

  // Check for NaN and Infinity
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError(
      \`divideRoundEvenV5: inputs must be finite numbers\`
    );
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError("division by zero");
  }

  // Compute the quotient
  const quotient = a / b;

  // Get the integer and fractional parts
  const integerPart = Math.trunc(quotient);
  const fractionalPart = quotient - integerPart;

  // If fractional part is exactly 0.5 (or -0.5 for negative), apply banker's rounding
  if (fractionalPart === 0.5) {
    // Round to the nearest even integer
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  } else if (fractionalPart === -0.5) {
    // For negative fractional parts, round to nearest even in the negative direction
    return integerPart % 2 === 0 ? integerPart : integerPart - 1;
  }

  // For non-half fractions, use standard rounding (Math.round)
  return Math.round(quotient);
}
`;

      const newContent = existingContent + "\n" + functionCode;
      fs.writeFileSync(utilsFilePath, newContent, "utf-8");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to ensure utils.ts exists: ${error.message}`
      );
    }
    throw error;
  }
}

// Call the setup function on module load
ensureUtilsFileExists().catch((error) => {
  console.error("Error setting up utils.ts:", error);
  process.exit(1);
});