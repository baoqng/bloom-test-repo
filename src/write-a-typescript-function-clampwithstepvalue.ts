// bloom-deps:

function clampWithStep(value: unknown, min: unknown, max: unknown, step: unknown): number {
  // Validate value is a finite number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }

  // Validate min is a finite number
  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new TypeError('min must be a finite number');
  }

  // Validate max is a finite number
  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw new TypeError('max must be a finite number');
  }

  // Validate step is a positive finite number
  if (typeof step !== 'number' || !Number.isFinite(step) || step <= 0) {
    throw new TypeError('step must be a positive finite number');
  }

  // Validate min <= max
  if (min > max) {
    throw new RangeError('min must be less than or equal to max');
  }

  // Clamp value to [min, max]
  let clamped = value;
  if (clamped < min) {
    clamped = min;
  } else if (clamped > max) {
    clamped = max;
  }

  // Round to nearest multiple of step using banker's rounding (half-to-even)
  const quotient = clamped / step;
  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  let rounded: number;

  if (fract < 0.5) {
    // Round down
    rounded = floor * step;
  } else if (fract > 0.5) {
    // Round up
    rounded = (floor + 1) * step;
  } else {
    // Exact tie (fract === 0.5): banker's rounding (round to even)
    if (floor % 2 === 0) {
      // floor is even, round down
      rounded = floor * step;
    } else {
      // floor is odd, round up
      rounded = (floor + 1) * step;
    }
  }

  // Ensure result stays within [min, max] due to floating-point precision
  if (rounded < min) {
    rounded = min;
  } else if (rounded > max) {
    rounded = max;
  }

  return rounded;
}

export { clampWithStep };