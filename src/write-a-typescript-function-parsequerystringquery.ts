// bloom-deps:

export function parseQueryString(query: string): Record<string, string> {
  if (typeof query !== 'string' || query.length === 0) {
    return {};
  }

  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return {};
  }

  let normalized = trimmed;
  if (normalized.startsWith('?')) {
    normalized = normalized.slice(1);
  }

  if (normalized.length === 0) {
    return {};
  }

  const result: Record<string, string> = {};
  const pairs = normalized.split('&');

  for (const pair of pairs) {
    if (pair.length === 0) {
      continue;
    }

    const eqIndex = pair.indexOf('=');
    let key: string;
    let value: string;

    if (eqIndex === -1) {
      key = pair;
      value = '';
    } else {
      key = pair.slice(0, eqIndex);
      value = pair.slice(eqIndex + 1);
    }

    if (key.length > 0) {
      result[key] = value;
    }
  }

  return result;
}