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

  const symbol = options?.symbol !== undefined ? options.symbol : '$';
  const decimals = options?.decimals !== undefined ? options.decimals : 2;
  const thousandsSep = options?.thousandsSep !== undefined ? options.thousandsSep : ',';
  const decimalSep = options?.decimalSep !== undefined ? options.decimalSep : '.';
  const symbolAfter = options?.symbolAfter !== undefined ? options.symbolAfter : false;
  const negativeParens = options?.negativeParens !== undefined ? options.negativeParens : false;

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

  const roundedStr = rounded.toFixed(decimals);

  let integerPart: string;
  let decimalPart: string;

  const dotIndex = roundedStr.indexOf('.');
  if (dotIndex !== -1) {
    integerPart = roundedStr.slice(0, dotIndex);
    decimalPart = roundedStr.slice(dotIndex + 1);
  } else {
    integerPart = roundedStr;
    decimalPart = '';
  }

  // Format integer part with thousands separators
  let formattedInteger = '';
  const intLen = integerPart.length;
  for (let i = 0; i < intLen; i++) {
    if (i > 0 && (intLen - i) % 3 === 0) {
      formattedInteger += thousandsSep;
    }
    formattedInteger += integerPart[i];
  }

  let formatted = formattedInteger;
  if (decimals > 0) {
    formatted += decimalSep + decimalPart;
  }

  let result: string;
  if (symbolAfter) {
    result = formatted + symbol;
  } else {
    result = symbol + formatted;
  }

  if (isNegative) {
    if (negativeParens) {
      result = `(${result})`;
    } else {
      result = `-${result}`;
    }
  }

  return result;
}

export { formatCurrency };