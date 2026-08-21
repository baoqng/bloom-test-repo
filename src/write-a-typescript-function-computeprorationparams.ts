// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function computeProration(params: {
  currentPlanPrice: number;
  newPlanPrice: number;
  daysRemaining: number;
  billingCycleDays: number;
}): {
  credit: number;
  charge: number;
  netAmount: number;
  isUpgrade: boolean;
} {
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  const { currentPlanPrice, newPlanPrice, daysRemaining, billingCycleDays } = params as {
    currentPlanPrice: unknown;
    newPlanPrice: unknown;
    daysRemaining: unknown;
    billingCycleDays: unknown;
  };

  if (typeof currentPlanPrice !== 'number' || !isFinite(currentPlanPrice)) {
    throw new TypeError('currentPlanPrice must be a finite number');
  }
  if (typeof newPlanPrice !== 'number' || !isFinite(newPlanPrice)) {
    throw new TypeError('newPlanPrice must be a finite number');
  }
  if (typeof daysRemaining !== 'number' || !isFinite(daysRemaining)) {
    throw new TypeError('daysRemaining must be a finite number');
  }
  if (typeof billingCycleDays !== 'number' || !isFinite(billingCycleDays)) {
    throw new TypeError('billingCycleDays must be a finite number');
  }

  if (currentPlanPrice < 0) {
    throw new RangeError('currentPlanPrice must be non-negative');
  }
  if (newPlanPrice < 0) {
    throw new RangeError('newPlanPrice must be non-negative');
  }
  if (daysRemaining < 0) {
    throw new RangeError('daysRemaining must be non-negative');
  }
  if (billingCycleDays <= 0) {
    throw new RangeError('billingCycleDays must be a positive number');
  }
  if (daysRemaining > billingCycleDays) {
    throw new RangeError('daysRemaining cannot exceed billingCycleDays');
  }

  const ratio = daysRemaining / billingCycleDays;

  const credit = roundToTwoDecimals(currentPlanPrice * ratio);
  const charge = roundToTwoDecimals(newPlanPrice * ratio);
  const netAmount = roundToTwoDecimals(charge - credit);
  const isUpgrade = newPlanPrice > currentPlanPrice;

  return { credit, charge, netAmount, isUpgrade };
}