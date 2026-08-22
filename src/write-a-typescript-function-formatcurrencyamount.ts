// bloom-deps:

function formatCurrency(
  amount: unknown,
  options?: {
    symbol?: string;
    decimals?: number;
    thousandsSep?: string;
    decimalSep?: string;
    symbolAfter?: boolean;
    negativeParens?: boolean;
  }
): string {
  // Validate amount is a finite number
  if (typeof amount !== 'number' || !isFinite(amount)) {
    throw new TypeError('amount must be a finite number');
  }

  // Set defaults
  const symbol = options?.symbol ?? '$';
  const decimals = options?.decimals ?? 2;
  const thousandsSep = options?.thousandsSep ?? ',';
  const decimalSep = options?.decimalSep ?? '.';
  const symbolAfter = options?.symbolAfter ?? false;
  const negativeParens = options?.negativeParens ?? false;

  // Validate decimals is a non-negative integer
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError('decimals must be a non-negative integer');
  }

  // Validate thousandsSep and decimalSep are different
  if (thousandsSep === decimalSep) {
    throw new RangeError('thousandsSep and decimalSep must be different');
  }

  // Determine if amount is negative
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Round to the specified number of decimal places
  const scaled = absAmount * Math.pow(10, decimals);
  const rounded = Math.round(scaled);
  const integerPart = Math.floor(rounded / Math.pow(10, decimals));
  const decimalPart = rounded % Math.pow(10, decimals);

  // Format integer part with thousands separators
  const integerStr = integerPart.toString();
  const integerWithSeps = integerStr.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  // Build the formatted number string
  let formatted = integerWithSeps;
  if (decimals > 0) {
    const decimalStr = decimalPart.toString().padStart(decimals, '0');
    formatted = formatted + decimalSep + decimalStr;
  }

  // Apply symbol
  let result = symbolAfter ? formatted + symbol : symbol + formatted;

  // Apply negative formatting
  if (isNegative) {
    if (negativeParens) {
      result = '(' + result + ')';
    } else {
      result = '-' + result;
    }
  }

  return result;
}

export { formatCurrency };