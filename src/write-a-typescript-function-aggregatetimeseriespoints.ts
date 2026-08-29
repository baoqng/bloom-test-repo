// bloom-deps:

function isPlainObject(val: unknown): val is Record<string, unknown> {
  if (val === null) return false;
  if (typeof val !== 'object') return false;
  if (Array.isArray(val)) return false;
  let proto = Object.getPrototypeOf(val);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

export function aggregateTimeSeries(
  points: unknown,
  windowMs: unknown,
  aggregator: unknown
): Array<{ windowStart: number; windowEnd: number; value: number }> {
  if (!Array.isArray(points)) {
    throw new TypeError('points must be an array');
  }

  for (const point of points) {
    if (
      !isPlainObject(point) ||
      typeof (point as Record<string, unknown>).timestamp !== 'number' ||
      typeof (point as Record<string, unknown>).value !== 'number' ||
      !Number.isFinite((point as Record<string, unknown>).timestamp as number) ||
      !Number.isFinite((point as Record<string, unknown>).value as number)
    ) {
      throw new TypeError('Each point must have numeric timestamp and value');
    }
  }

  if (
    typeof windowMs !== 'number' ||
    !Number.isFinite(windowMs) ||
    !Number.isInteger(windowMs) ||
    windowMs <= 0
  ) {
    throw new TypeError('windowMs must be a positive integer');
  }

  if (
    aggregator !== 'sum' &&
    aggregator !== 'avg' &&
    aggregator !== 'min' &&
    aggregator !== 'max'
  ) {
    throw new TypeError("aggregator must be 'sum', 'avg', 'min', or 'max'");
  }

  const windowMap = new Map<number, number[]>();

  for (const point of points) {
    const p = point as { timestamp: number; value: number };
    const windowStart = Math.floor(p.timestamp / windowMs) * windowMs;
    if (!windowMap.has(windowStart)) {
      windowMap.set(windowStart, []);
    }
    windowMap.get(windowStart)!.push(p.value);
  }

  const result: Array<{ windowStart: number; windowEnd: number; value: number }> = [];

  for (const [windowStart, values] of windowMap.entries()) {
    if (values.length === 0) continue;

    let value: number;
    if (aggregator === 'sum') {
      value = values.reduce((acc, v) => acc + v, 0);
    } else if (aggregator === 'avg') {
      value = values.reduce((acc, v) => acc + v, 0) / values.length;
    } else if (aggregator === 'min') {
      value = Math.min(...values);
    } else {
      value = Math.max(...values);
    }

    result.push({
      windowStart,
      windowEnd: windowStart + windowMs,
      value,
    });
  }

  result.sort((a, b) => a.windowStart - b.windowStart);

  return result;
}