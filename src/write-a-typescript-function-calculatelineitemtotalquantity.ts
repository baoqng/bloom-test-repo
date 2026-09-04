// bloom-deps:

function calculateLineItemTotal(quantity: number, unitPrice: number, taxRate: number): number {
  // Validate that all inputs are numbers
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    throw new RangeError('quantity must be a valid number');
  }
  if (typeof unitPrice !== 'number' || isNaN(unitPrice)) {
    throw new RangeError('unitPrice must be a valid number');
  }
  if (typeof taxRate !== 'number' || isNaN(taxRate)) {
    throw new RangeError('taxRate must be a valid number');
  }

  // Validate quantity >= 1
  if (quantity < 1) {
    throw new RangeError('quantity must be at least 1');
  }

  // Validate unitPrice >= 0
  if (unitPrice < 0) {
    throw new RangeError('unitPrice must not be negative');
  }

  // Validate taxRate >= 0
  if (taxRate < 0) {
    throw new RangeError('taxRate must not be negative');
  }

  // Calculate and return total: quantity * unitPrice * (1 + taxRate)
  return quantity * unitPrice * (1 + taxRate);
}

export { calculateLineItemTotal };