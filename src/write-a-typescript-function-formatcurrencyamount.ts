// bloom-deps:

function formatCurrency(amount: unknown, currency: unknown, locale: unknown): string {
  if (typeof amount !== 'number' || !isFinite(amount)) {
    throw new TypeError('amount must be a finite number');
  }

  if (
    typeof currency !== 'string' ||
    currency.length !== 3 ||
    !/^[A-Z]{3}$/.test(currency)
  ) {
    throw new TypeError('currency must be a 3-letter ISO 4217 code');
  }

  if (typeof locale !== 'string' || locale.length === 0) {
    throw new TypeError('locale must be a non-empty string');
  }

  let formatter: Intl.NumberFormat;
  try {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    });
  } catch {
    throw new RangeError('Unsupported locale or currency');
  }

  return formatter.format(amount);
}

export { formatCurrency };