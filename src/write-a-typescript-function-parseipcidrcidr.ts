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

  const slashCount = (cidr.match(/\//g) || []).length;
  if (slashCount !== 1) {
    throw new SyntaxError('cidr must contain exactly one "/" character');
  }

  const slashIndex = cidr.indexOf('/');
  const addressPart = cidr.substring(0, slashIndex);
  const prefixPart = cidr.substring(slashIndex + 1);

  // Validate address part: exactly 4 dot-separated octets
  const octets = addressPart.split('.');
  if (octets.length !== 4) {
    throw new SyntaxError('address must consist of exactly 4 dot-separated octets');
  }

  for (const octetStr of octets) {
    // Must be a decimal integer string with no leading zeros (but allow negative check later)
    if (!/^-?[0-9]+$/.test(octetStr)) {
      throw new SyntaxError(`invalid octet: "${octetStr}"`);
    }
    // Check for leading zeros: length > 1 and starts with '0'
    if (octetStr.length > 1 && octetStr[0] === '0') {
      throw new RangeError(`octet has leading zeros: "${octetStr}"`);
    }
    const octetVal = parseInt(octetStr, 10);
    if (octetVal < 0 || octetVal > 255) {
      throw new RangeError(`octet out of range [0, 255]: ${octetVal}`);
    }
  }

  // Validate prefix part: decimal integer string with no leading zeros (except '0')
  if (!/^-?[0-9]+$/.test(prefixPart)) {
    throw new SyntaxError(`invalid prefix format: "${prefixPart}"`);
  }
  if (prefixPart.length > 1 && prefixPart[0] === '0') {
    throw new SyntaxError(`prefix has leading zeros: "${prefixPart}"`);
  }

  const prefix = parseInt(prefixPart, 10);
  if (prefix < 0 || prefix > 32) {
    throw new RangeError(`prefix length out of range [0, 32]: ${prefix}`);
  }

  // Build the 32-bit IP address
  const octetValues = octets.map(o => parseInt(o, 10));
  const ipNum =
    ((octetValues[0] << 24) |
     (octetValues[1] << 16) |
     (octetValues[2] << 8) |
     octetValues[3]) >>> 0;

  // Compute network address: zero the host bits
  const mask = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
  const networkNum = (ipNum & mask) >>> 0;

  // Compute broadcast address: set all host bits to 1
  const hostBits = prefix === 0 ? 0xffffffff : (~mask >>> 0);
  const broadcastNum = (networkNum | hostBits) >>> 0;

  // Compute host count
  const hostCount = Math.max(0, Math.pow(2, 32 - prefix) - 2);

  return {
    address: addressPart,
    prefix,
    networkAddress: toOctetString(networkNum),
    broadcastAddress: toOctetString(broadcastNum),
    hostCount,
  };
}