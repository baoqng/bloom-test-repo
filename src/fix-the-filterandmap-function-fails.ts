```typescript
import { ServiceError } from './errors';

export function filterAndMap<T, U>(
  items: T[],
  predicate: (item: T) => boolean,
  mapper: (item: T) => U
): U[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const result: U[] = [];

  for (const item of items) {
    if (item === null || item === undefined) {
      continue;
    }

    try {
      if (predicate(item)) {
        result.push(mapper(item));
      }
    } catch (error) {
      throw new ServiceError('operation failed', { cause: error });
    }
  }

  return result;
}
```