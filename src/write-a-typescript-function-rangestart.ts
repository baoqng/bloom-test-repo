// bloom-deps:

export function range(start: number, end: number, step: number = 1): number[] {
  if (typeof start !== 'number' || !Number.isFinite(start)) {
    throw new TypeError('start must be a finite number');
  }
  if (typeof end !== 'number' || !Number.isFinite(end)) {
    throw new TypeError('end must be a finite number');
  }
  if (typeof step !== 'number' || !Number.isFinite(step)) {
    throw new TypeError('step must be a finite number');
  }
  if (step <= 0) {
    throw new TypeError('step must be greater than 0');
  }

  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}