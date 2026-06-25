```typescript
import { ServiceError } from './errors';

export function filterAndMap<T, U>(items: T[], predicate: (item: T) => boolean, mapper: (item: T) => U): U[] {
  if (!items || items.length === 0) {
    return [];
  }

  const result: U[] = [];

  for (const item of items) {
    if (item === null || item === undefined) {
      continue;
    }

    let predicateResult: boolean;
    try {
      predicateResult = predicate(item);
    } catch (error) {
      throw new ServiceError('operation failed', { cause: error });
    }

    if (predicateResult) {
      let mapped: U;
      try {
        mapped = mapper(item);
      } catch (error) {
        throw new ServiceError('operation failed', { cause: error });
      }
      result.push(mapped);
    }
  }

  return result;
}
```