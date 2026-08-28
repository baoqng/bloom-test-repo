// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

const KNOWN_FLAGS: Record<string, boolean> = {
  'feature-new-ui': true,
  'feature-dark-mode': false,
  'feature-beta-api': true,
};

export function resolveFeatureFlag(flagKey: unknown, context: unknown): boolean {
  if (typeof flagKey !== 'string' || flagKey.length === 0) {
    throw new TypeError('flagKey must be a non-empty string');
  }

  if (
    !isPlainObject(context) ||
    typeof (context as Record<string, unknown>).userId !== 'string' ||
    ((context as Record<string, unknown>).userId as string).length === 0
  ) {
    throw new TypeError('context must be an object with a non-empty userId');
  }

  if (!(flagKey in KNOWN_FLAGS)) {
    return false;
  }

  return KNOWN_FLAGS[flagKey];
}