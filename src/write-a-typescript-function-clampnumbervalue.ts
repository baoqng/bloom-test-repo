// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`Expected value to be a finite number, got ${typeof value}`);
  }
  
  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new TypeError(`Expected min to be a finite number, got ${typeof min}`);
  }
  
  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw new TypeError(`Expected max to be a finite number, got ${typeof max}`);
  }
  
  // Validate min <= max constraint
  if (min > max) {
    throw new RangeError(`min (${min}) must be less than or equal to max (${max})`);
  }
  
  // Clamp value to [min, max]
  return Math.max(min, Math.min(max, value));
}

export { clampNumber };