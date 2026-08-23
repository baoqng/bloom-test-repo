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
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new TypeError('amount must be a finite number');
  }

  const symbol = options?.symbol ?? '$';
  const decimals = options?.decimals ?? 2;
  const thousandsSep = options?.thousandsSep ?? ',';
  const decimalSep = options?.decimalSep ?? '.';
  const symbolAfter = options?.symbolAfter ?? false;
  const negativeParens = options?.negativeParens ?? false;

  if (options?.decimals !== undefined) {
    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new RangeError('decimals must be a non-negative integer');
    }
  }

  if (thousandsSep === decimalSep) {
    throw new RangeError('thousandsSep and decimalSep must be different');
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const factor = Math.pow(10, decimals);
  const rounded = Math.round(absAmount * factor) / factor;

  const fixedStr = rounded.toFixed(decimals);

  let integerPart: string;
  let decimalPart: string;

  const dotIndex = fixedStr.indexOf('.');
  if (dotIndex === -1) {
    integerPart = fixedStr;
    decimalPart = '';
  } else {
    integerPart = fixedStr.slice(0, dotIndex);
    decimalPart = fixedStr.slice(dotIndex + 1);
  }

  // Format integer part with thousands separators
  const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  let numberStr: string;
  if (decimals > 0) {
    numberStr = integerFormatted + decimalSep + decimalPart;
  } else {
    numberStr = integerFormatted;
  }

  let result: string;
  if (symbolAfter) {
    result = numberStr + symbol;
  } else {
    result = symbol + numberStr;
  }

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