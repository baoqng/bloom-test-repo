// bloom-deps:

async function withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  if (typeof primary !== 'function') {
    throw new TypeError('primary must be a function');
  }
  if (typeof fallback !== 'function') {
    throw new TypeError('fallback must be a function');
  }

  try {
    const result = await primary();
    return result;
  } catch (_primaryError) {
    const fallbackResult = await fallback();
    return fallbackResult;
  }
}

export { withFallback };