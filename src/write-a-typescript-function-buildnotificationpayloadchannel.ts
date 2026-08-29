// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildNotificationPayload(
  channel: unknown,
  recipient: unknown,
  template: unknown,
  variables: unknown
): Record<string, unknown> {
  if (channel !== 'email' && channel !== 'sms' && channel !== 'push') {
    throw new TypeError("channel must be 'email', 'sms', or 'push'");
  }

  if (typeof recipient !== 'string' || recipient.length === 0) {
    throw new TypeError('recipient must be a non-empty string');
  }

  if (typeof template !== 'string' || template.length === 0) {
    throw new TypeError('template must be a non-empty string');
  }

  if (!isPlainObject(variables)) {
    throw new TypeError('variables must be a plain object');
  }

  if (channel === 'email') {
    if (!recipient.includes('@')) {
      throw new RangeError('Invalid email recipient');
    }
  }

  if (channel === 'sms') {
    if (!recipient.startsWith('+') || !/^\+\d+$/.test(recipient)) {
      throw new RangeError('Invalid phone recipient');
    }
  }

  return {
    channel,
    recipient,
    template,
    variables,
    scheduledAt: null,
    attempts: 0,
    createdAt: Date.now(),
  };
}