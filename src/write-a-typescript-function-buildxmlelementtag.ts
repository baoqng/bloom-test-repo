// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Check that Object.prototype is the direct prototype (plain object)
      return Object.getPrototypeOf(value) === Object.prototype;
    }
    proto = Object.getPrototypeOf(proto);
  }
  // proto chain ended at null without hitting Object.prototype as direct parent
  // This means it's Object.create(null)
  return Object.getPrototypeOf(value) === null;
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildXmlElement(tag: unknown, attrs: unknown, children: unknown): string {
  // Validate tag
  if (typeof tag !== 'string' || tag.length === 0) {
    throw new TypeError('tag must be a non-empty string');
  }

  // Validate tag characters
  if (/[\s<>&"]/.test(tag)) {
    throw new SyntaxError('tag contains invalid XML characters');
  }

  // Validate attrs
  if (!isPlainObject(attrs)) {
    throw new TypeError('attrs must be a plain object');
  }

  // Validate children
  if (typeof children !== 'string') {
    if (!Array.isArray(children)) {
      throw new TypeError('children must be a string or array of strings');
    }
    for (const child of children) {
      if (typeof child !== 'string') {
        throw new TypeError('children must be a string or array of strings');
      }
    }
  }

  // Build attributes string
  const attrsObj = attrs as Record<string, unknown>;
  let attrsStr = '';
  for (const key of Object.keys(attrsObj)) {
    const val = attrsObj[key];
    attrsStr += ` ${key}="${xmlEscape(String(val))}"`;
  }

  // Determine if self-closing
  const isEmpty =
    (typeof children === 'string' && children === '') ||
    (Array.isArray(children) && children.length === 0);

  if (isEmpty) {
    return `<${tag}${attrsStr}/>`;
  }

  // Build content
  let content: string;
  if (typeof children === 'string') {
    content = xmlEscape(children);
  } else {
    content = (children as string[]).map(xmlEscape).join('');
  }

  return `<${tag}${attrsStr}>${content}</${tag}>`;
}