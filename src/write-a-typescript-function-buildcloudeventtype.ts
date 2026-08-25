// bloom-deps:

import { randomUUID } from 'crypto';

export function buildCloudEvent(
  type: unknown,
  source: unknown,
  data: unknown
): {
  specversion: string;
  id: string;
  type: string;
  source: string;
  time: string;
  datacontenttype: string;
  data: unknown;
} {
  // Validate type
  if (typeof type !== 'string' || type.length === 0) {
    throw new TypeError('type must be a non-empty string');
  }

  const reverseDnsPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
  if (!reverseDnsPattern.test(type)) {
    throw new SyntaxError('type must be a reverse-DNS name');
  }

  // Validate source
  if (typeof source !== 'string' || source.length === 0) {
    throw new TypeError('source must be a non-empty string');
  }

  if (/\s/.test(source)) {
    throw new SyntaxError('source must be a valid URI path');
  }

  const id = randomUUID();
  const time = new Date().toISOString();

  return {
    specversion: '1.0',
    id,
    type,
    source,
    time,
    datacontenttype: 'application/json',
    data,
  };
}