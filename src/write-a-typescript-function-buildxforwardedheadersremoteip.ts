// bloom-deps:

export function buildXForwardedHeaders(
  remoteIp: unknown,
  existingForwarded: unknown,
  proto: unknown,
  host: unknown
): Record<string, string> {
  if (typeof remoteIp !== 'string' || remoteIp.length === 0) {
    throw new TypeError('remoteIp must be a non-empty string');
  }

  if (existingForwarded !== null && typeof existingForwarded !== 'string') {
    throw new TypeError('existingForwarded must be a string or null');
  }

  if (proto !== 'http' && proto !== 'https') {
    throw new TypeError("proto must be 'http' or 'https'");
  }

  if (typeof host !== 'string' || host.length === 0) {
    throw new TypeError('host must be a non-empty string');
  }

  let forwardedFor: string;
  if (existingForwarded === null || existingForwarded === '') {
    forwardedFor = remoteIp;
  } else {
    forwardedFor = `${remoteIp}, ${existingForwarded}`;
  }

  return {
    'X-Forwarded-For': forwardedFor,
    'X-Forwarded-Proto': proto,
    'X-Forwarded-Host': host,
  };
}