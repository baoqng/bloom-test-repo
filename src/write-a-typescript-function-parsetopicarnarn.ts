// bloom-deps:

export function parseTopicArn(arn: unknown): {
  partition: string;
  service: string;
  region: string;
  accountId: string;
  resource: string;
} {
  if (typeof arn !== 'string' || arn.length === 0) {
    throw new TypeError('arn must be a non-empty string');
  }

  if (!arn.startsWith('arn:')) {
    throw new SyntaxError('Not a valid ARN');
  }

  // Count colons
  let colonCount = 0;
  for (let i = 0; i < arn.length; i++) {
    if (arn[i] === ':') colonCount++;
  }

  if (colonCount !== 5) {
    throw new SyntaxError('Not a valid ARN');
  }

  // Split into exactly 6 parts using indexOf+slice to split on first 5 colons
  // parts: ['arn', partition, service, region, accountId, resource]
  const parts: string[] = [];
  let remaining = arn;
  for (let i = 0; i < 5; i++) {
    const idx = remaining.indexOf(':');
    if (idx === -1) {
      throw new SyntaxError('Not a valid ARN');
    }
    parts.push(remaining.slice(0, idx));
    remaining = remaining.slice(idx + 1);
  }
  parts.push(remaining);

  // parts[0] should be 'arn'
  if (parts[0] !== 'arn') {
    throw new SyntaxError('Not a valid ARN');
  }

  const partition = parts[1];
  const service = parts[2];
  const region = parts[3];
  const accountId = parts[4];
  const resource = parts[5];

  if (partition.length === 0) {
    throw new RangeError('ARN partition must not be empty');
  }

  if (service.length === 0) {
    throw new RangeError('ARN service must not be empty');
  }

  if (resource.length === 0) {
    throw new RangeError('ARN resource must not be empty');
  }

  return {
    partition,
    service,
    region,
    accountId,
    resource,
  };
}