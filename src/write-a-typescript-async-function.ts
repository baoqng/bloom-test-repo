// bloom-deps:

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError(`url must be a non-empty string`);
  }

  if (typeof timeoutMs !== 'number' || isNaN(timeoutMs) || timeoutMs <= 0) {
    throw new TypeError(`timeoutMs must be a positive number`);
  }

  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timerId);
  }
}

export { fetchWithTimeout };