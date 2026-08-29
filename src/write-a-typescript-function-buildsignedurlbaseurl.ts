// bloom-deps:
import { createHmac } from 'crypto';

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  return Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
}

export function buildSignedUrl(
  baseUrl: unknown,
  params: unknown,
  secret: unknown,
  expiresInSeconds: unknown
): string {
  if (typeof baseUrl !== 'string' || baseUrl.length === 0) {
    throw new TypeError('baseUrl must be a non-empty string');
  }

  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  if (
    typeof expiresInSeconds !== 'number' ||
    !Number.isFinite(expiresInSeconds) ||
    !Number.isInteger(expiresInSeconds) ||
    expiresInSeconds <= 0
  ) {
    throw new TypeError('expiresInSeconds must be a positive integer');
  }

  const plainParams = params as Record<string, unknown>;
  const allParams: Record<string, string> = {};

  for (const key of Object.keys(plainParams)) {
    allParams[key] = String(plainParams[key]);
  }

  allParams['expires'] = String(Math.floor(Date.now() / 1000) + expiresInSeconds);

  const sortedKeys = Object.keys(allParams).sort();

  const searchParams = new URLSearchParams();
  for (const key of sortedKeys) {
    searchParams.append(key, allParams[key]);
  }

  const queryString = searchParams.toString().replace(/\+/g, '%20');

  const urlToSign = `${baseUrl}?${queryString}`;

  const hmac = createHmac('sha256', secret);
  hmac.update(urlToSign);
  const signature = hmac.digest('hex');

  return `${urlToSign}&sig=${signature}`;
}