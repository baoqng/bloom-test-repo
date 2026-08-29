// bloom-deps:
import { createHmac } from 'crypto';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  // If we never hit Object.prototype, it's not a plain object
  // But actually we need to check if the immediate proto is Object.prototype
  // Let's redo this properly
  return false;
}

function isPlainObjectFixed(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  const proto = Object.getPrototypeOf(value);
  // Walk the full prototype chain to verify it terminates at Object.prototype
  if (proto === null) return true; // Object.create(null)
  if (proto === Object.prototype) return true;
  
  // Walk further up - if it eventually reaches Object.prototype through a chain
  // that's not just one step, it's a class instance, not a plain object
  let p = proto;
  while (p !== null) {
    if (p === Object.prototype) {
      // Check that the direct prototype is Object.prototype or null
      return proto === Object.prototype || proto === null;
    }
    p = Object.getPrototypeOf(p);
  }
  return false;
}

export function buildSignedUrl(
  baseUrl: unknown,
  params: unknown,
  secret: unknown,
  expiresInSeconds: unknown
): string {
  // Validate baseUrl
  if (typeof baseUrl !== 'string' || baseUrl.length === 0) {
    throw new TypeError('baseUrl must be a non-empty string');
  }

  // Validate params
  if (!isPlainObjectFixed(params)) {
    throw new TypeError('params must be a plain object');
  }

  // Validate secret
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  // Validate expiresInSeconds
  if (
    typeof expiresInSeconds !== 'number' ||
    !Number.isFinite(expiresInSeconds) ||
    !Number.isInteger(expiresInSeconds) ||
    expiresInSeconds <= 0
  ) {
    throw new TypeError('expiresInSeconds must be a positive integer');
  }

  // Build params object with expires injected
  const allParams: Record<string, unknown> = { ...(params as Record<string, unknown>) };
  allParams['expires'] = Math.floor(Date.now() / 1000) + expiresInSeconds;

  // Sort keys alphabetically
  const sortedKeys = Object.keys(allParams).sort();

  // Build query string using URLSearchParams for proper encoding, then replace + with %20
  const searchParams = new URLSearchParams();
  for (const key of sortedKeys) {
    searchParams.append(key, String(allParams[key]));
  }
  const queryString = searchParams.toString().replace(/\+/g, '%20');

  // Compute HMAC-SHA256
  const urlToSign = `${baseUrl}?${queryString}`;
  const hmac = createHmac('sha256', secret);
  hmac.update(urlToSign);
  const signature = hmac.digest('hex');

  // Append sig param
  const sigParam = `sig=${encodeURIComponent(signature)}`;
  const finalUrl = `${urlToSign}&${sigParam}`;

  return finalUrl;
}