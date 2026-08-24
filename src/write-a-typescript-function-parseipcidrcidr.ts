function numberToOctets(num: number): string {
  return [
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff,
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

  const slashParts = cidr.split('/');
  if (slashParts.length !== 2) {
    throw new SyntaxError('cidr must contain exactly one "/" character');
  }

  const [addressPart, prefixPart] = slashParts;

  // Validate prefix format: must be a decimal integer string with no leading zeros (except '0' itself)
  // Allow optional leading minus sign for negative numbers (which will fail range check)
  if (!/^-?\d+$/.test(prefixPart)) {
    throw new SyntaxError('prefix length must be a decimal integer string with no leading zeros');
  }
  if (prefixPart.length > 1 && prefixPart[0] !== '-' && prefixPart[0] === '0') {
    throw new SyntaxError('prefix length must not have leading zeros');
  }
  // Check leading zeros after minus sign
  if (prefixPart[0] === '-' && prefixPart.length > 2 && prefixPart[1] === '0') {
    throw new SyntaxError('prefix length must not have leading zeros');
  }

  const prefix = parseInt(prefixPart, 10);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new RangeError('prefix length must be an integer in [0, 32]');
  }

  // Validate address: exactly 4 dot-separated decimal octets
  const octets = addressPart.split('.');
  if (octets.length !== 4) {
    throw new SyntaxError('address must consist of exactly 4 dot-separated decimal octets');
  }

  for (const octet of octets) {
    if (!/^-?\d+$/.test(octet)) {
      throw new SyntaxError('each octet must be a decimal integer');
    }
    if (octet.length > 1 && octet[0] !== '-' && octet[0] === '0') {
      throw new RangeError('octets must not have leading zeros');
    }
    const value = parseInt(octet, 10);
    if (value < 0 || value > 255) {
      throw new RangeError(`octet value ${value} is out of range [0, 255]`);
    }
  }

  const address = addressPart;

  // Convert address to 32-bit integer
  const addrNum =
    ((parseInt(octets[0], 10) << 24) |
      (parseInt(octets[1], 10) << 16) |
      (parseInt(octets[2], 10) << 8) |
      parseInt(octets[3], 10)) >>>
    0;

  // Compute network address: zero out host bits
  const mask = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
  const networkNum = (addrNum & mask) >>> 0;

  // Compute broadcast address: set all host bits to 1
  const hostBits = prefix === 0 ? 0xffffffff : (~mask >>> 0);
  const broadcastNum = (networkNum | hostBits) >>> 0;

  const networkAddress = numberToOctets(networkNum);
  const broadcastAddress = numberToOctets(broadcastNum);

  const hostCount = Math.max(0, 2 ** (32 - prefix) - 2);

  return {
    address,
    prefix,
    networkAddress,
    broadcastAddress,
    hostCount,
  };
}