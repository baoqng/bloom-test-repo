```typescript
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) {
    throw new RangeError(`chunk size must be a positive integer, got ${size}`);
  }

  if (items.length === 0) {
    return [];
  }

  const result: T[][] = [];
  let page = 1;

  while ((page - 1) * size < items.length) {
    result.push(items.slice((page - 1) * size, (page - 1) * size + size));
    page++;
  }

  return result;
}
```