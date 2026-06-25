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
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    result.push(items.slice(startIndex, endIndex));
    if (endIndex >= items.length) break;
  }

  return result;
}
```