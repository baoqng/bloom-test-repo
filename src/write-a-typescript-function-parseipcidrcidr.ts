// bloom-deps:

function toOctetString(ip: number): string {
  const o1 = (ip >>> 24) & 0xff;
  const o2 = (ip >>> 16) & 0xff;
  const o3 = (ip >>> 8) & 0xff;
  const o4 = ip & 0xff;
  return `${o1}.${o2}.${o3}.${o4}`;
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
  if (!/^\d+$/.test(prefixPart)) {
    throw new SyntaxError('prefix length must be a decimal integer string with no leading zeros');
  }
  if (prefixPart.length > 1 && prefixPart[0] === '0') {
    throw new SyntaxError('prefix length must not have leading zeros');
  }

  const prefix = parseInt(prefixPart, 10);
  if (prefix < 0 || prefix > 32) {
    throw new RangeError(`prefix length must be in [0, 32], got ${prefix}`);
  }

  // Validate address format: exactly 4 dot-separated decimal octets
  const octets = addressPart.split('.');
  if (octets.length !== 4) {
    throw new SyntaxError('address must consist of exactly 4 dot-separated decimal octets');
  }

  const octetValues: number[] = [];
  for (const octet of octets) {
    if (!/^\d+$/.test(octet) || octet.length === 0) {
      throw new SyntaxError('each octet must be a decimal integer');
    }
    // Check for leading zeros: '00', '01', etc.
    if (octet.length > 1 && octet[0] === '0') {
      throw new RangeError(`octet "${octet}" has leading zeros`);
    }
    const val = parseInt(octet, 10);
    if (val < 0 || val > 255) {
      throw new RangeError(`octet value ${val} is out of range [0, 255]`);
    }
    octetValues.push(val);
  }

  // Build 32-bit IP number
  const ipNumber =
    ((octetValues[0] << 24) |
      (octetValues[1] << 16) |
      (octetValues[2] << 8) |
      octetValues[3]) >>> 0;

  // Compute network address by applying bitmask
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkNumber = (ipNumber & mask) >>> 0;

  // Compute broadcast address by setting all host bits to 1
  const hostMask = (~mask) >>> 0;
  const broadcastNumber = (networkNumber | hostMask) >>> 0;

  // Compute usable host count
  const hostCount = Math.max(0, Math.pow(2, 32 - prefix) - 2);

  return {
    address: addressPart,
    prefix,
    networkAddress: toOctetString(networkNumber),
    broadcastAddress: toOctetString(broadcastNumber),
    hostCount,
  };
}