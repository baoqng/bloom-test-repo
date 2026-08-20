// bloom-deps:

function formatNumber(
  value: unknown,
  options?: { decimals?: number; thousandsSep?: string; decimalSep?: string }
): string {
  // Validate value is a finite number
  if (!Number.isFinite(value)) {
    throw new TypeError('Expected finite number');
  }

  // Validate value is non-negative
  if ((value as number) < 0) {
    throw new RangeError('Expected finite non-negative number');
  }

  // Validate and set defaults for options
  const decimals = options?.decimals ?? 2;
  const thousandsSep = options?.thousandsSep ?? ',';
  const decimalSep = options?.decimalSep ?? '.';

  // Validate decimals
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError('decimals must be a non-negative integer');
  }

  // Validate thousandsSep and decimalSep are strings
  if (typeof thousandsSep !== 'string') {
    throw new TypeError('thousandsSep must be a string');
  }
  if (typeof decimalSep !== 'string') {
    throw new TypeError('decimalSep must be a string');
  }

  // Validate thousandsSep and decimalSep are not the same
  if (thousandsSep === decimalSep) {
    throw new RangeError('thousandsSep and decimalSep must not be the same character');
  }

  // value is guaranteed to be non-negative at this point
  const absValue = value as number;

  // Round to the specified number of decimals
  const multiplier = Math.pow(10, decimals);
  const rounded = Math.round(absValue * multiplier) / multiplier;

  // Split into integer and decimal parts
  const parts = rounded.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Add thousands separator to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  // Combine parts with custom decimal separator
  let result = integerPart;
  if (decimals > 0) {
    result += decimalSep + decimalPart;
  }

  return result;
}

export { formatNumber };