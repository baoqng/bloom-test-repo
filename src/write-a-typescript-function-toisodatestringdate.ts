// bloom-deps:

function toISODateString(date: unknown): string {
  if (!(date instanceof Date)) {
    throw new TypeError("Expected a Date object");
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export { toISODateString };