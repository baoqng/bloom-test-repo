// bloom-deps:

export function compactV4(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    return [];
  }
  
  return arr.filter((item): item is Exclude<unknown, false | null | undefined | 0 | "" | NaN> => {
    if (item === 0 || item === "" || item === false || item === null || item === undefined) {
      return false;
    }
    if (typeof item === "number" && Number.isNaN(item)) {
      return false;
    }
    return true;
  });
}