// bloom-deps:

function formatCurrency(amount: unknown, currency: unknown): string {
  if (typeof amount !== 'number' || !isFinite(amount)) {
    throw new TypeError('amount must be a finite number');
  }
  if (typeof currency !== 'string' || currency.length === 0) {
    throw new TypeError('currency must be a non-empty string');
  }
  return `${currency} ${amount.toFixed(2)}`;
}

export { formatCurrency };