// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseLinkHeader(header: unknown): Array<{ url: string; rel: string }> {
  // [REQUIRED] typeof check for string input
  if (typeof header !== 'string') {
    throw new TypeError(`Expected header to be a string, got ${typeof header}`);
  }

  // [REQUIRED] Handle empty string and whitespace-only cases
  const trimmed = header.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const result: Array<{ url: string; rel: string }> = [];

  // Split by comma to get individual entries
  const entries = header.split(',');

  for (const entry of entries) {
    const trimmedEntry = entry.trim();
    if (trimmedEntry.length === 0) {
      continue;
    }

    // Extract URL from <...>
    const urlMatch = trimmedEntry.match(/<([^>]+)>/);
    if (!urlMatch || !urlMatch[1]) {
      // [REQUIRED] Skip entries missing URL
      continue;
    }
    const url = urlMatch[1];

    // Extract rel parameter value
    // Match rel="value" or rel=value (both quoted and unquoted)
    const relMatch = trimmedEntry.match(/;\s*rel\s*=\s*"?([^";,\s]+)"?/i);
    if (!relMatch || !relMatch[1]) {
      // [REQUIRED] Skip entries missing rel parameter
      continue;
    }
    const rel = relMatch[1];

    result.push({ url, rel });
  }

  return result;
}