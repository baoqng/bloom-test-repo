export function roundTieEvenV3(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  let result: number;

  if (fraction < 0.5) {
    result = floor;
  } else if (fraction > 0.5) {
    result = ceil;
  } else if (fraction === 0.5) {
    result = floor % 2 === 0 ? floor : ceil;
  } else {
    result = x;
  }

  // Convert -0 to +0
  if (result === 0) {
    return 0;
  }

  return result;
}