// bloom-deps:

async function fetchWithRetry(url: string, options: RequestInit, maxAttempts: number): Promise<Response> {
  if (typeof url !== 'string' || url === '') {
    throw new TypeError('url must be a non-empty string');
  }

  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts <= 0
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

export { fetchWithRetry };