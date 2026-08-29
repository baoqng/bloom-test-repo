// bloom-deps:

function ipToUint32(octets: number[]): number {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function uint32ToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join('.');
}

export function parseIpCidr(input: unknown): {
  address: string;
  prefixLength: number;
  networkAddress: string;
  broadcastAddress: string;
} {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Count '/' occurrences explicitly using indexOf+slice, not split
  const slashIndex = input.indexOf('/');
  if (slashIndex === -1) {
    throw new SyntaxError('Not a valid CIDR notation');
  }
  // Ensure exactly one '/'
  const afterSlash = input.slice(slashIndex + 1);
  if (afterSlash.indexOf('/') !== -1) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  const ipPart = input.slice(0, slashIndex);
  const prefixPart = afterSlash;

  // Validate prefix part is non-empty and numeric
  if (prefixPart.length === 0 || !/^\d+$/.test(prefixPart)) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  // Validate IP part format: must have exactly 3 dots
  const dotCount = (ipPart.match(/\./g) || []).length;
  if (dotCount !== 3) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  // Parse octets using indexOf+slice approach, track that we processed valid entries
  const octets: number[] = [];
  let remaining = ipPart;
  let hasProcessedAny = false;

  for (let i = 0; i < 4; i++) {
    let octetStr: string;
    if (i < 3) {
      const dotIdx = remaining.indexOf('.');
      if (dotIdx === -1) {
        throw new SyntaxError('Not a valid CIDR notation');
      }
      octetStr = remaining.slice(0, dotIdx);
      remaining = remaining.slice(dotIdx + 1);
    } else {
      octetStr = remaining;
    }

    if (octetStr.length === 0) {
      throw new SyntaxError('Not a valid CIDR notation');
    }

    if (!/^\d+$/.test(octetStr)) {
      throw new SyntaxError('Not a valid CIDR notation');
    }

    // Check for leading zeros
    if (octetStr.length > 1 && octetStr[0] === '0') {
      throw new RangeError('Invalid IPv4 address');
    }

    const octetVal = parseInt(octetStr, 10);
    if (octetVal < 0 || octetVal > 255) {
      throw new RangeError('Invalid IPv4 address');
    }

    octets.push(octetVal);
    hasProcessedAny = true;
  }

  if (!hasProcessedAny || octets.length !== 4) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  // Parse and validate prefix length
  const prefix = parseInt(prefixPart, 10);
  if (prefix < 0 || prefix > 32) {
    throw new RangeError('Prefix length must be 0-32');
  }

  const ip = ipToUint32(octets);

  // Compute mask, network, and broadcast using unsigned 32-bit arithmetic
  const mask = prefix === 0 ? 0 : ((0xFFFFFFFF << (32 - prefix)) >>> 0);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;

  return {
    address: uint32ToIp(ip),
    prefixLength: prefix,
    networkAddress: uint32ToIp(network),
    broadcastAddress: uint32ToIp(broadcast),
  };
}