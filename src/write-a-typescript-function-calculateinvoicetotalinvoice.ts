// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  return Object.getPrototypeOf(v) === Object.prototype;
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function calculateInvoiceTotal(invoice: {
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  globalDiscount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}): {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  lineItemTotals: Array<{
    description: string;
    subtotal: number;
    taxAmount: number;
    total: number;
  }>;
} {
  if (!isPlainObject(invoice)) {
    throw new TypeError('invoice must be a plain object');
  }

  const { lineItems, globalDiscount } = invoice as {
    lineItems: unknown;
    globalDiscount?: unknown;
  };

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    throw new TypeError('lineItems must be a non-empty array');
  }

  const lineItemTotals: Array<{
    description: string;
    subtotal: number;
    taxAmount: number;
    total: number;
  }> = [];

  for (let i = 0; i < lineItems.length; i++) {
    const item = lineItems[i] as Record<string, unknown>;

    const description = item['description'];
    if (typeof description !== 'string' || description.trim().length === 0) {
      throw new TypeError(`lineItem at index ${i}: description must be a non-empty string`);
    }

    const quantity = item['quantity'];
    if (
      typeof quantity !== 'number' ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      throw new TypeError(`lineItem at index ${i}: quantity must be a positive finite number`);
    }

    const unitPrice = item['unitPrice'];
    if (
      typeof unitPrice !== 'number' ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      throw new TypeError(`lineItem at index ${i}: unitPrice must be a non-negative finite number`);
    }

    let taxRate = 0;
    if ('taxRate' in item && item['taxRate'] !== undefined) {
      const tr = item['taxRate'];
      if (
        typeof tr !== 'number' ||
        !Number.isFinite(tr) ||
        tr < 0 ||
        tr > 1
      ) {
        throw new RangeError(`lineItem at index ${i}: taxRate must be between 0 and 1`);
      }
      taxRate = tr;
    }

    const itemSubtotal = round2(quantity * unitPrice);
    const itemTaxAmount = round2(itemSubtotal * taxRate);
    const itemTotal = round2(itemSubtotal + itemTaxAmount);

    lineItemTotals.push({
      description: description,
      subtotal: itemSubtotal,
      taxAmount: itemTaxAmount,
      total: itemTotal,
    });
  }

  const invoiceSubtotal = round2(
    lineItemTotals.reduce((sum, li) => sum + li.subtotal, 0)
  );

  let discountAmount = 0;

  if (globalDiscount !== undefined) {
    if (!isPlainObject(globalDiscount)) {
      throw new TypeError('globalDiscount.type must be percentage or fixed');
    }

    const discountType = (globalDiscount as Record<string, unknown>)['type'];
    const discountValue = (globalDiscount as Record<string, unknown>)['value'];

    if (discountType !== 'percentage' && discountType !== 'fixed') {
      throw new TypeError('globalDiscount.type must be percentage or fixed');
    }

    if (
      typeof discountValue !== 'number' ||
      !Number.isFinite(discountValue) ||
      discountValue < 0
    ) {
      throw new RangeError('globalDiscount.value must be a non-negative finite number');
    }

    if (discountType === 'percentage') {
      const computed = round2((discountValue / 100) * invoiceSubtotal);
      discountAmount = Math.min(computed, invoiceSubtotal);
      discountAmount = round2(discountAmount);
    } else {
      discountAmount = round2(Math.min(discountValue, invoiceSubtotal));
    }
  }

  const discountedSubtotal = round2(invoiceSubtotal - discountAmount);

  const taxAmount = round2(
    lineItemTotals.reduce((sum, li) => sum + li.taxAmount, 0)
  );

  const total = round2(discountedSubtotal + taxAmount);

  return {
    subtotal: invoiceSubtotal,
    discountAmount,
    taxAmount,
    total,
    lineItemTotals,
  };
}