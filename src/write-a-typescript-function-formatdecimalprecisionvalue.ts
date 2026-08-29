// bloom-deps:

function formatDecimalPrecision(value: unknown, precision: unknown): string {
  // Validate value is a finite number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }

  // Validate precision is an integer in [1, 21]
  if (
    typeof precision !== 'number' ||
    !Number.isInteger(precision) ||
    precision < 1 ||
    precision > 21
  ) {
    throw new TypeError('precision must be a positive integer between 1 and 21');
  }

  // Handle zero case
  if (value === 0) {
    return '0';
  }

  // Handle negative values by formatting magnitude and prepending '-'
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  // Convert to string in exponential notation to extract mantissa and exponent
  const exponentialStr = absValue.toExponential();
  const eIndex = exponentialStr.indexOf('e');
  if (eIndex === -1) {
    throw new Error('Unexpected: toExponential() did not contain "e"');
  }

  const mantissaStr = exponentialStr.slice(0, eIndex);
  const exponentStr = exponentialStr.slice(eIndex + 1);
  const exponent = parseInt(exponentStr, 10);

  // Remove decimal point from mantissa to get all significant digits
  const mantissaDigits = mantissaStr.replace('.', '');

  // Calculate the position of the decimal point in the final result
  // The exponent tells us how many places the decimal is from the first digit
  // For a number like 1234: mantissa is "1.234", exponent is 3
  // For a number like 0.001234: mantissa is "1.234", exponent is -3
  const decimalPosition = exponent + 1;

  // Extract the required number of significant digits
  let significantDigits = mantissaDigits.slice(0, precision);

  // Pad with zeros if we don't have enough digits
  if (significantDigits.length < precision) {
    significantDigits = significantDigits.padEnd(precision, '0');
  }

  // Round if needed (check if the next digit is >= 5)
  if (mantissaDigits.length > precision) {
    const nextDigit = parseInt(mantissaDigits[precision], 10);
    if (nextDigit >= 5) {
      // Increment the significant digits
      let digits = significantDigits.split('');
      let carry = 1;
      for (let i = digits.length - 1; i >= 0 && carry; i--) {
        const digit = parseInt(digits[i], 10) + carry;
        if (digit === 10) {
          digits[i] = '0';
          carry = 1;
        } else {
          digits[i] = digit.toString();
          carry = 0;
        }
      }
      if (carry) {
        digits.unshift('1');
      }
      significantDigits = digits.join('');
    }
  }

  // Build the result string based on decimal position
  let result: string;

  if (decimalPosition <= 0) {
    // Number like 0.001234: we need leading zeros
    result = '0.' + '0'.repeat(-decimalPosition) + significantDigits;
  } else if (decimalPosition >= significantDigits.length) {
    // Number like 1200: we need trailing zeros but no decimal point
    result = significantDigits + '0'.repeat(decimalPosition - significantDigits.length);
  } else {
    // Number like 12.34: decimal point is in the middle
    result =
      significantDigits.slice(0, decimalPosition) +
      '.' +
      significantDigits.slice(decimalPosition);
  }

  // Remove trailing zeros after decimal point
  if (result.includes('.')) {
    result = result.replace(/\.?0+$/, '');
  }

  // Prepend '-' if negative
  if (isNegative) {
    result = '-' + result;
  }

  return result;
}

export { formatDecimalPrecision };