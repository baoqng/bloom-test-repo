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

  let intPart: string;
  let decPart: string;

  const dotIndex = fixedStr.indexOf('.');
  if (dotIndex === -1) {
    intPart = fixedStr;
    decPart = '';
  } else {
    intPart = fixedStr.slice(0, dotIndex);
    decPart = fixedStr.slice(dotIndex + 1);
  }

  // Format integer part with thousands separators
  let formattedInt = '';
  const intLen = intPart.length;
  for (let i = 0; i < intLen; i++) {
    if (i > 0 && (intLen - i) % 3 === 0) {
      formattedInt += thousandsSep;
    }
    formattedInt += intPart[i];
  }

  let numberStr = formattedInt;
  if (decimals > 0) {
    numberStr += decimalSep + decPart;
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