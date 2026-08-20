// bloom-deps:

function roundHalfEven(value: unknown, decimals: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('Expected number');
  }

  if (!Number.isInteger(decimals) || (decimals as number) < 0) {
    throw new TypeError('Expected non-negative integer');
  }

  const dec = decimals as number;
  const factor = Math.pow(10, dec);
  const scaled = value * factor;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;

  let rounded: number;

  if (diff === 0.5) {
    // Half-to-even: round to nearest even
    if (floor % 2 === 0) {
      rounded = floor / factor;
    } else {
      rounded = (floor + 1) / factor;
    }
  } else {
    rounded = Math.round(scaled) / factor;
  }

  // Normalize -0 to 0
  if (Object.is(rounded, -0)) {
    return 0;
  }

  return rounded;
}

export { roundHalfEven };