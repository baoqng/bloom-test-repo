// bloom-deps:

export function parseRetryBudget(header: unknown): { maxAttempts: number; delayMs: number } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  // Use regex with \s*=\s* for key=value parsing
  const pattern = /^\s*max\s*=\s*(\d+)\s*;\s*delay\s*=\s*(\d+)ms\s*$/;
  const match = header.match(pattern);

  if (!match) {
    throw new TypeError(`header is not in the expected format 'max=N; delay=Nms': ${header}`);
  }

  const maxAttempts = Number(match[1]);
  const delayMs = Number(match[2]);

  if (maxAttempts < 1) {
    throw new TypeError(`maxAttempts must be at least 1, got ${maxAttempts}`);
  }

  if (delayMs < 0) {
    throw new TypeError(`delayMs must be at least 0, got ${delayMs}`);
  }

  return { maxAttempts, delayMs };
}