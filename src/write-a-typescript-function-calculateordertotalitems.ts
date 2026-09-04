// bloom-deps:

export interface OrderItem {
  price: number;
  quantity?: number;
}

export function calculateOrderTotal(items: OrderItem[], discount: number): number {
  if (
    typeof discount !== 'number' ||
    discount === null ||
    isNaN(discount) ||
    discount < 0 ||
    discount > 100
  ) {
    throw new RangeError('Discount must be a number between 0 and 100');
  }

  const subtotal = items.reduce((sum, item) => {
    const qty = item.quantity !== undefined ? item.quantity : 1;
    return sum + item.price * qty;
  }, 0);

  const total = subtotal * (1 - discount / 100);
  return total;
}