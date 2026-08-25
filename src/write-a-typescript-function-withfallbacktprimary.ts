// bloom-deps:

async function withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  if (typeof primary !== 'function') {
    throw new TypeError('primary must be a function');
  }
  if (typeof fallback !== 'function') {
    throw new TypeError('fallback must be a function');
  }

  let primaryResult: T;
  let primaryFailed = false;

  try {
    primaryResult = await primary();
  } catch {
    primaryFailed = true;
  }

  if (!primaryFailed) {
    return primaryResult!;
  }

  try {
    const fallbackResult = await fallback();
    return fallbackResult;
  } catch (fallbackError) {
    throw fallbackError;
  }
}

export { withFallback };