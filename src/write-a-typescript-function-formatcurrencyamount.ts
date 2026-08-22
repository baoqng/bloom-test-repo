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

  const intPart = Math.floor(rounded);
  const fracPart = Math.round((rounded - intPart) * factor);

  const intStr = intPart.toString();
  let formattedInt = '';
  const len = intStr.length;
  for (let i = 0; i < len; i++) {
    if (i > 0 && (len - i) % 3 === 0) {
      formattedInt += thousandsSep;
    }
    formattedInt += intStr[i];
  }

  let numberStr = formattedInt;
  if (decimals > 0) {
    const fracStr = fracPart.toString().padStart(decimals, '0');
    numberStr += decimalSep + fracStr;
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