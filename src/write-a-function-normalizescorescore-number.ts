// bloom-deps:

function normalizeScore(score: number, min: number, max: number): number {
  if (typeof score !== 'number' || !isFinite(score)) {
    throw new TypeError('score must be a finite number');
  }
  if (typeof min !== 'number' || !isFinite(min)) {
    throw new TypeError('min must be a finite number');
  }
  if (typeof max !== 'number' || !isFinite(max)) {
    throw new TypeError('max must be a finite number');
  }
  if (min >= max) {
    throw new RangeError('min must be less than max');
  }
  return (score - min) / (max - min);
}

export { normalizeScore };