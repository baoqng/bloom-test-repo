// bloom-deps:

function formatMinorCurrency(amount: unknown, currencyCode: unknown, locale: unknown): string {
  if (typeof amount !== 'number') {
    throw new TypeError('amount must be a number');
  }
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    throw new TypeError('amount must be a finite integer');
  }
  if (amount < 0) {
    throw new RangeError('amount must be non-negative');
  }
  if (typeof currencyCode !== 'string' || !/^[A-Z]{3}$/.test(currencyCode)) {
    throw new TypeError('currencyCode must be a 3-letter string');
  }
  if (typeof locale !== 'string' || locale.length === 0) {
    throw new TypeError('locale must be a non-empty string');
  }

  let formatter: Intl.NumberFormat;
  try {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    });
  } catch {
    throw new RangeError('Invalid locale or currency');
  }

  return formatter.format(amount / 100);
}

export { formatMinorCurrency };