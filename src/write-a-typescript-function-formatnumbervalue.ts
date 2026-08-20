// bloom-deps:

function formatNumber(
  value: unknown,
  options?: { decimals?: number; thousandsSep?: string; decimalSep?: string }
): string {
  // Validate value is a finite number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('Expected finite number');
  }

  // Extract and validate options
  const decimals = options?.decimals ?? 2;
  const thousandsSep = options?.thousandsSep ?? ',';
  const decimalSep = options?.decimalSep ?? '.';

  // Validate decimals is a non-negative integer
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError('decimals must be a non-negative integer');
  }

  // Validate thousandsSep is a string
  if (typeof thousandsSep !== 'string') {
    throw new TypeError('thousandsSep must be a string');
  }

  // Validate decimalSep is a string
  if (typeof decimalSep !== 'string') {
    throw new TypeError('decimalSep must be a string');
  }

  // Validate thousandsSep and decimalSep are not the same character
  if (thousandsSep === decimalSep) {
    throw new RangeError('thousandsSep and decimalSep must not be the same character');
  }

  // Handle negative numbers
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  // Round to specified decimal places
  const multiplier = Math.pow(10, decimals);
  const rounded = Math.round(absValue * multiplier) / multiplier;

  // Split into integer and decimal parts
  const parts = rounded.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Add thousands separators to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  // Construct the result
  let result = integerPart;
  if (decimals > 0) {
    result += decimalSep + decimalPart;
  }

  // Add negative sign if necessary
  if (isNegative) {
    result = '-' + result;
  }

  return result;
}

export { formatNumber };