// bloom-deps:

function safeParseInt(s: unknown): number | null {
  if (typeof s !== 'string') return null;
  const trimmed = s.trim();
  if (trimmed === '') return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) return null;
  return parsed;
}

export { safeParseInt };