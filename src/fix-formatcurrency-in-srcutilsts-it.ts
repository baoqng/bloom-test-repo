// bloom-deps:

export function formatCurrency(amount: unknown, currencyCode: unknown): string {
  if (amount === null || amount === undefined) {
    throw new TypeError('amount is required');
  }
  if (currencyCode === null || currencyCode === undefined) {
    throw new TypeError('currencyCode is required');
  }
  if (typeof amount !== 'number') {
    throw new TypeError('amount must be a number');
  }
  if (typeof currencyCode !== 'string') {
    throw new TypeError('currencyCode must be a string');
  }
  if (currencyCode.trim().length !== 3) {
    throw new TypeError('currencyCode must be a 3-letter ISO code');
  }
  if (amount < 0) {
    throw new RangeError('amount must be non-negative');
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode.trim().toUpperCase(),
  }).format(amount);
}