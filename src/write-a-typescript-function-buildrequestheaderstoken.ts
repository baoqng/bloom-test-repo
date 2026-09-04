// bloom-deps: uuid@^9

import { v4 as uuidv4 } from 'uuid';

export function buildRequestHeaders(token: string, contentType: string): Record<string, string> {
  // Validate token is not empty or whitespace-only
  if (!token || !token.trim()) {
    throw new TypeError('token must not be empty or whitespace-only');
  }

  // Build and return headers object
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': contentType,
    'X-Request-Id': uuidv4(),
  };
}