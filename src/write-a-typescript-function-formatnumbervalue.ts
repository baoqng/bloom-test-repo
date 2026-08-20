// bloom-deps:

function formatNumber(
  value: unknown,
  options?: { decimals?: number; thousandsSep?: string; decimalSep?: string }
): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('Expected finite number');
  }

  if (value < 0) {
    throw new RangeError('value must be non-negative');
  }

  const decimals = options?.decimals !== undefined ? options.decimals : 2;
  const thousandsSep = options?.thousandsSep !== undefined ? options.thousandsSep : ',';
  const decimalSep = options?.decimalSep !== undefined ? options.decimalSep : '.';

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError('decimals must be a non-negative integer');
  }

  if (thousandsSep === decimalSep) {
    throw new RangeError('thousandsSep and decimalSep must not be the same character');
  }

  const absValue = value;

  const fixed = absValue.toFixed(decimals);

  let intPart: string;
  let decPart: string | undefined;

  const dotIndex = fixed.indexOf('.');
  if (dotIndex !== -1) {
    intPart = fixed.slice(0, dotIndex);
    decPart = fixed.slice(dotIndex + 1);
  } else {
    intPart = fixed;
    decPart = undefined;
  }

  // Add thousands separator
  let formattedInt = '';
  const intLen = intPart.length;
  for (let i = 0; i < intLen; i++) {
    if (i > 0 && (intLen - i) % 3 === 0 && thousandsSep !== '') {
      formattedInt += thousandsSep;
    }
    formattedInt += intPart[i];
  }

  let result = formattedInt;
  if (decPart !== undefined && decimals > 0) {
    result += decimalSep + decPart;
  }

  return result;
}

export { formatNumber };