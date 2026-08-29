// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  
  return false;
}

function buildJwks(keys: unknown): { keys: Array<Record<string, unknown>> } {
  if (!Array.isArray(keys)) {
    throw new TypeError('keys must be a non-empty array');
  }
  
  if (keys.length === 0) {
    throw new TypeError('keys must be a non-empty array');
  }
  
  const standardFields = new Set([
    'kty',
    'use',
    'key_ops',
    'alg',
    'kid',
    'x5u',
    'x5c',
    'x5t',
    'x5t#S256',
    'n',
    'e',
    'x',
    'y',
    'crv'
  ]);
  
  const privateFields = new Set(['d', 'p', 'q', 'dp', 'dq', 'qi', 'k']);
  
  const processedKeys: Array<Record<string, unknown>> = [];
  
  for (const key of keys) {
    if (!isPlainObject(key)) {
      throw new TypeError('Each key must have a string kty field');
    }
    
    const keyObj = key as Record<string, unknown>;
    
    if (typeof keyObj.kty !== 'string') {
      throw new TypeError('Each key must have a string kty field');
    }
    
    for (const fieldName of privateFields) {
      if (fieldName in keyObj) {
        throw new TypeError('Key must not have private fields');
      }
    }
    
    const strippedKey: Record<string, unknown> = {};
    
    for (const [fieldName, fieldValue] of Object.entries(keyObj)) {
      if (standardFields.has(fieldName)) {
        strippedKey[fieldName] = fieldValue;
      }
    }
    
    processedKeys.push(strippedKey);
  }
  
  return { keys: processedKeys };
}

export { buildJwks };