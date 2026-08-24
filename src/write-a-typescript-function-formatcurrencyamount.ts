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
  // Validate amount
  if (typeof amount !== 'number' || !isFinite(amount)) {
    throw new TypeError('amount must be a finite number');
  }

  // Extract options with defaults
  const symbol = options?.symbol ?? '$';
  const decimals = options?.decimals ?? 2;
  const thousandsSep = options?.thousandsSep ?? ',';
  const decimalSep = options?.decimalSep ?? '.';
  const symbolAfter = options?.symbolAfter ?? false;
  const negativeParens = options?.negativeParens ?? false;

  // Validate decimals if provided
  if (options?.decimals !== undefined) {
    if (
      typeof options.decimals !== 'number' ||
      !Number.isInteger(options.decimals) ||
      options.decimals < 0
    ) {
      throw new RangeError('decimals must be a non-negative integer');
    }
  }

  // Validate separators are different
  if (thousandsSep === decimalSep) {
    throw new RangeError('thousandsSep and decimalSep must be different');
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Round to specified decimal places
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(absAmount * factor) / factor;

  // Format the number
  const roundedStr = rounded.toFixed(decimals);

  // Split into integer and decimal parts
  const dotIndex = roundedStr.indexOf('.');
  let integerPart: string;
  let decimalPart: string;

  if (dotIndex === -1) {
    integerPart = roundedStr;
    decimalPart = '';
  } else {
    integerPart = roundedStr.slice(0, dotIndex);
    decimalPart = roundedStr.slice(dotIndex + 1);
  }

  // Apply thousands separator to integer part
  const integerWithSep = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  // Build formatted number string
  let formatted: string;
  if (decimals > 0 && decimalPart.length > 0) {
    formatted = integerWithSep + decimalSep + decimalPart;
  } else {
    formatted = integerWithSep;
  }

  // Apply symbol position
  let result: string;
  if (symbolAfter) {
    result = formatted + symbol;
  } else {
    result = symbol + formatted;
  }

  // Apply sign/negative formatting
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