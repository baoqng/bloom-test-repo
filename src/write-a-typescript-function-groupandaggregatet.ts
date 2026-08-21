// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  let proto = v;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(v) === proto;
}

export function groupAndAggregate<T extends Record<string, unknown>>(
  items: T[],
  groupKey: string,
  aggregations: Record<string, { field: string; fn: 'sum' | 'avg' | 'min' | 'max' | 'count' }>
): Record<string, Record<string, number>> {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  if (typeof groupKey !== 'string' || groupKey.length === 0) {
    throw new TypeError('groupKey must be a non-empty string');
  }

  if (!isPlainObject(aggregations)) {
    throw new TypeError('aggregations must be a plain object');
  }

  const validFns = new Set(['sum', 'avg', 'min', 'max', 'count']);

  for (const name of Object.keys(aggregations)) {
    const agg = aggregations[name];
    if (
      typeof agg.field !== 'string' ||
      agg.field.length === 0
    ) {
      throw new TypeError(`aggregation "${name}": field must be a non-empty string`);
    }
    if (!validFns.has(agg.fn)) {
      throw new TypeError(`aggregation "${name}": fn must be sum, avg, min, max, or count`);
    }
  }

  if (items.length === 0) {
    return {};
  }

  const groups = new Map<string, T[]>();

  for (const item of items) {
    const groupValue = String(item[groupKey]);
    if (!groups.has(groupValue)) {
      groups.set(groupValue, []);
    }
    groups.get(groupValue)!.push(item);
  }

  const result: Record<string, Record<string, number>> = {};

  for (const [groupValue, groupItems] of groups.entries()) {
    result[groupValue] = {};

    for (const [aggName, agg] of Object.entries(aggregations)) {
      const { field, fn } = agg;

      if (fn === 'count') {
        result[groupValue][aggName] = groupItems.length;
        continue;
      }

      const numericValues: number[] = [];
      for (const item of groupItems) {
        const val = item[field];
        if (typeof val === 'number' && Number.isFinite(val)) {
          numericValues.push(val);
        }
      }

      if (numericValues.length === 0) {
        result[groupValue][aggName] = 0;
        continue;
      }

      if (fn === 'sum') {
        result[groupValue][aggName] = numericValues.reduce((acc, v) => acc + v, 0);
      } else if (fn === 'avg') {
        const sum = numericValues.reduce((acc, v) => acc + v, 0);
        result[groupValue][aggName] = sum / numericValues.length;
      } else if (fn === 'min') {
        result[groupValue][aggName] = Math.min(...numericValues);
      } else if (fn === 'max') {
        result[groupValue][aggName] = Math.max(...numericValues);
      }
    }
  }

  return result;
}