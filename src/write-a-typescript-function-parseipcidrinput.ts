// bloom-deps:

function toUint32(n: number): number {
  return n >>> 0;
}

function ipToUint32(octets: number[]): number {
  return toUint32(
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3])
  );
}

function uint32ToIp(n: number): string {
  const a = (n >>> 24) & 0xff;
  const b = (n >>> 16) & 0xff;
  const c = (n >>> 8) & 0xff;
  const d = n & 0xff;
  return `${a}.${b}.${c}.${d}`;
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
  // Ensure exactly one slash
  const secondSlash = input.indexOf('/', slashIndex + 1);
  if (secondSlash !== -1) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  const ipPart = input.slice(0, slashIndex);
  const prefixPart = input.slice(slashIndex + 1);

  if (ipPart.length === 0 || prefixPart.length === 0) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  // Validate prefix length is numeric digits only
  if (!/^\d+$/.test(prefixPart)) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  // Parse IP address: count dots explicitly
  const dotCount = (ipPart.match(/\./g) || []).length;
  if (dotCount !== 3) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  // Parse octets using indexOf/slice to count delimiters explicitly
  const octetStrings: string[] = [];
  let remaining = ipPart;
  let dotIdx: number;
  while ((dotIdx = remaining.indexOf('.')) !== -1) {
    octetStrings.push(remaining.slice(0, dotIdx));
    remaining = remaining.slice(dotIdx + 1);
  }
  octetStrings.push(remaining);

  if (octetStrings.length !== 4) {
    throw new SyntaxError('Not a valid CIDR notation');
  }

  // Validate each octet
  const octets: number[] = [];
  for (const octetStr of octetStrings) {
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
    const val = parseInt(octetStr, 10);
    if (val < 0 || val > 255) {
      throw new RangeError('Invalid IPv4 address');
    }
    octets.push(val);
  }

  const prefixLength = parseInt(prefixPart, 10);
  if (prefixLength < 0 || prefixLength > 32) {
    throw new RangeError('Prefix length must be 0-32');
  }

  const address = `${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}`;
  const ipInt = ipToUint32(octets);

  let networkAddress: string;
  let broadcastAddress: string;

  if (prefixLength === 0) {
    networkAddress = '0.0.0.0';
    broadcastAddress = '255.255.255.255';
  } else if (prefixLength === 32) {
    networkAddress = address;
    broadcastAddress = address;
  } else {
    const mask = toUint32((0xffffffff << (32 - prefixLength)) >>> 0);
    const network = toUint32(ipInt & mask);
    const broadcast = toUint32(network | (~mask >>> 0));
    networkAddress = uint32ToIp(network);
    broadcastAddress = uint32ToIp(broadcast);
  }

  return {
    address,
    prefixLength,
    networkAddress,
    broadcastAddress,
  };
}