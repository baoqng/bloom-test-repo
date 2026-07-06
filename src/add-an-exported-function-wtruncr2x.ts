export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  if (Object.is(x, -0)) return 0;
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const diffFloor = x - floor;
  const diffCeil = ceil - x;
  let result: number;
  if (diffFloor < diffCeil) {
    result = floor;
  } else if (diffFloor > diffCeil) {
    result = ceil;
  } else {
    // Exact half — round to even
    if (floor % 2 === 0) {
      result = floor;
    } else {
      result = ceil;
    }
  }
  return Object.is(result, -0) ? 0 : result;
}