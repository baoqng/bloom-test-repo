// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function parseFeatureFlagConfig(
  input: unknown
): Record<string, { enabled: boolean; rolloutPct: number; allowList: string[] }> {
  if (!isPlainObject(input)) {
    throw new TypeError('input must be a plain object');
  }

  const record = input as Record<string, unknown>;
  const result: Record<string, { enabled: boolean; rolloutPct: number; allowList: string[] }> = {};

  for (const flagName of Object.keys(record)) {
    const flagValue = record[flagName];

    if (!isPlainObject(flagValue)) {
      throw new TypeError(`Flag config for ${flagName} must be a plain object`);
    }

    const flagObj = flagValue as Record<string, unknown>;

    // Validate enabled
    if (typeof flagObj['enabled'] !== 'boolean') {
      throw new TypeError(`${flagName}.enabled must be a boolean`);
    }
    const enabled = flagObj['enabled'] as boolean;

    // Validate rolloutPct
    let rolloutPct = 100;
    if ('rolloutPct' in flagObj) {
      const rp = flagObj['rolloutPct'];
      if (typeof rp !== 'number' || rp < 0 || rp > 100) {
        throw new RangeError(`${flagName}.rolloutPct must be between 0 and 100`);
      }
      rolloutPct = rp;
    }

    // Validate allowList
    let allowList: string[] = [];
    if ('allowList' in flagObj) {
      const al = flagObj['allowList'];
      if (
        !Array.isArray(al) ||
        !(al as unknown[]).every((item) => typeof item === 'string')
      ) {
        throw new TypeError(`${flagName}.allowList must be an array of strings`);
      }
      allowList = al as string[];
    }

    result[flagName] = { enabled, rolloutPct, allowList };
  }

  return result;
}