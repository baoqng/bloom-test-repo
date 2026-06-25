```typescript
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) {
    throw new RangeError(`chunk size must be a positive integer, got ${size}`);
  }

  if (items.length === 0) {
    return [];
  }

  const result: T[][] = [];

  for (let page = 1; page * size <= items.length + size; page++) {
    const start = (page - 1) * size;
    const end = start + size;
    if (start < items.length) {
      result.push(items.slice(start, end));
    }
  }

  return result;
}
```