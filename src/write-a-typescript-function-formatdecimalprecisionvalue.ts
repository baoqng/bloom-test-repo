// bloom-deps:

function formatDecimalPrecision(value: unknown, precision: unknown): string {
  // Validate value is a finite number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }

  // Validate precision is a positive integer between 1 and 21
  if (
    typeof precision !== 'number' ||
    !Number.isFinite(precision) ||
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

  // Handle negative values by working with magnitude
  const isNegative = value < 0;
  const magnitude = Math.abs(value);

  // Use toPrecision directly for the most reliable significant digit handling
  let resultStr = magnitude.toPrecision(precision);

  // Convert from potential scientific notation to decimal notation
  const numResult = parseFloat(resultStr);
  if (Number.isFinite(numResult)) {
    // For very small or very large numbers, we need to format without scientific notation
    if (resultStr.includes('e')) {
      // Find the order of magnitude
      const orderOfMagnitude = Math.floor(Math.log10(magnitude));
      
      // Determine how many decimal places we need
      let decimalPlaces = 0;
      if (orderOfMagnitude >= 0) {
        // For numbers >= 1
        const integerDigits = orderOfMagnitude + 1;
        if (integerDigits < precision) {
          decimalPlaces = precision - integerDigits;
        }
      } else {
        // For numbers < 1
        decimalPlaces = precision - orderOfMagnitude - 1;
      }
      
      // Use toFixed with the computed decimal places, then parse to remove trailing zeros
      resultStr = numResult.toFixed(decimalPlaces);
    } else {
      resultStr = numResult.toString();
    }
  }

  // Remove trailing zeros after decimal point
  if (resultStr.includes('.')) {
    resultStr = resultStr.replace(/\.?0+$/, '');
  }

  // Prepend negative sign if needed
  if (isNegative) {
    resultStr = '-' + resultStr;
  }

  return resultStr;
}

export { formatDecimalPrecision };