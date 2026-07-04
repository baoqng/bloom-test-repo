export function roundValueV3(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  let result: number;

  if (fraction < 0.5) {
    result = floor;
  } else if (fraction > 0.5) {
    result = ceil;
  } else {
    result = floor % 2 === 0 ? floor : ceil;
  }

  // Avoid returning -0; normalize to +0
  return result === 0 ? 0 : result;
}