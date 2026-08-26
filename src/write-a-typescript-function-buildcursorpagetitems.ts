// bloom-deps:

export interface CursorPage<T> {
  items: T[];
  hasNextPage: boolean;
  nextCursor: string | null;
  total: number;
}

export function buildCursorPage<T>(
  items: unknown,
  pageSize: unknown,
  encodeCursor: unknown
): CursorPage<T> {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  if (typeof pageSize !== "number") {
    throw new TypeError("pageSize must be a number");
  }

  if (typeof encodeCursor !== "function") {
    throw new TypeError("encodeCursor must be a function");
  }

  if (
    isNaN(pageSize) ||
    !Number.isInteger(pageSize) ||
    pageSize <= 0 ||
    pageSize > 1000
  ) {
    throw new RangeError(
      "pageSize must be a positive integer and must not exceed 1000"
    );
  }

  const total = items.length;

  if (items.length > pageSize) {
    const sliced = items.slice(0, pageSize) as T[];
    const cursor = encodeCursor(items[pageSize - 1]) as string;
    return {
      items: sliced,
      hasNextPage: true,
      nextCursor: cursor,
      total,
    };
  } else {
    return {
      items: items as T[],
      hasNextPage: false,
      nextCursor: null,
      total,
    };
  }
}