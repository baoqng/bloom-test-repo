// bloom-deps:

function octetsToDword(octets: number[]): number {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function dwordToOctets(dword: number): string {
  return [
    (dword >>> 24) & 0xff,
    (dword >>> 16) & 0xff,
    (dword >>> 8) & 0xff,
    dword & 0xff,
  ].join('.');
}

export function parseIPCIDR(cidr: unknown): {
  address: string;
  prefix: number;
  networkAddress: string;
  broadcastAddress: string;
  hostCount: number;
} {
  if (typeof cidr !== 'string' || cidr.length === 0) {
    throw new TypeError('cidr must be a non-empty string');
  }

  // Count '/' occurrences explicitly
  const firstSlash = cidr.indexOf('/');
  if (firstSlash === -1) {
    throw new SyntaxError('cidr must contain exactly one "/" character');
  }
  const secondSlash = cidr.indexOf('/', firstSlash + 1);
  if (secondSlash !== -1) {
    throw new SyntaxError('cidr must contain exactly one "/" character');
  }

  const addressPart = cidr.slice(0, firstSlash);
  const prefixPart = cidr.slice(firstSlash + 1);

  // Validate address: exactly 4 dot-separated decimal octets
  const dotParts = addressPart.split('.');
  if (dotParts.length !== 4) {
    throw new SyntaxError('address must consist of exactly 4 dot-separated decimal octets');
  }

  const octets: number[] = [];
  for (const part of dotParts) {
    if (part.length === 0) {
      throw new SyntaxError('address must consist of exactly 4 dot-separated decimal octets');
    }
    // No leading zeros (except '0' itself)
    if (part.length > 1 && part[0] === '0') {
      throw new RangeError(`octet "${part}" has leading zeros`);
    }
    // Must be all digits
    if (!/^\d+$/.test(part)) {
      throw new SyntaxError('address must consist of exactly 4 dot-separated decimal octets');
    }
    const value = parseInt(part, 10);
    if (value < 0 || value > 255) {
      throw new RangeError(`octet "${part}" is out of range [0, 255]`);
    }
    octets.push(value);
  }

  // Validate prefix length
  if (prefixPart.length === 0) {
    throw new SyntaxError('prefix length must be a decimal integer string');
  }
  if (!/^\d+$/.test(prefixPart)) {
    throw new SyntaxError('prefix length must be a decimal integer string with no leading zeros');
  }
  // No leading zeros except '0' itself
  if (prefixPart.length > 1 && prefixPart[0] === '0') {
    throw new SyntaxError('prefix length must not have leading zeros');
  }

  const prefix = parseInt(prefixPart, 10);
  if (prefix < 0 || prefix > 32) {
    throw new RangeError(`prefix length ${prefix} is not in [0, 32]`);
  }

  const addressDword = octetsToDword(octets);

  let networkDword: number;
  let broadcastDword: number;

  if (prefix === 0) {
    networkDword = 0;
    broadcastDword = 0xffffffff >>> 0;
  } else {
    const mask = (0xffffffff << (32 - prefix)) >>> 0;
    networkDword = (addressDword & mask) >>> 0;
    broadcastDword = (networkDword | (~mask >>> 0)) >>> 0;
  }

  const hostCount = Math.max(0, Math.pow(2, 32 - prefix) - 2);

  return {
    address: addressPart,
    prefix,
    networkAddress: dwordToOctets(networkDword),
    broadcastAddress: dwordToOctets(broadcastDword),
    hostCount,
  };
}