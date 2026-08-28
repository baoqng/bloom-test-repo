// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Array.prototype) return false;
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function resolveQualifiedName(
  qname: unknown,
  namespaces: unknown
): { namespace: string; localName: string } {
  if (typeof qname !== 'string') {
    throw new TypeError('qname must be a string');
  }

  if (
    namespaces === null ||
    typeof namespaces !== 'object' ||
    Array.isArray(namespaces)
  ) {
    throw new TypeError('namespaces must be an object');
  }

  const trimmed = qname.trim();
  if (trimmed.length === 0) {
    throw new RangeError('qname must not be empty');
  }

  const colonIndex = qname.indexOf(':');

  let prefix: string;
  let localName: string;

  if (colonIndex === -1) {
    prefix = '';
    localName = qname;
  } else {
    prefix = qname.slice(0, colonIndex);
    localName = qname.slice(colonIndex + 1);

    if (prefix.length === 0) {
      throw new RangeError('prefix must not be empty');
    }

    if (localName.length === 0) {
      throw new RangeError('localName must not be empty');
    }
  }

  const nsMap = namespaces as Record<string, unknown>;

  if (!Object.prototype.hasOwnProperty.call(nsMap, prefix)) {
    throw new RangeError(`unknown namespace prefix: ${prefix}`);
  }

  const resolvedUri = nsMap[prefix];

  if (typeof resolvedUri !== 'string') {
    throw new TypeError('namespace URI must be a string');
  }

  return { namespace: resolvedUri, localName };
}