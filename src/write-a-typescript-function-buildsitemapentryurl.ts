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
  // Actually need to check if direct prototype is Object.prototype or null
  const directProto = Object.getPrototypeOf(value);
  return directProto === Object.prototype || directProto === null;
}

function xmlEscape(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '&') result += '&amp;';
    else if (ch === '<') result += '&lt;';
    else if (ch === '>') result += '&gt;';
    else if (ch === '"') result += '&quot;';
    else if (ch === "'") result += '&apos;';
    else result += ch;
  }
  return result;
}

const VALID_CHANGEFREQ = new Set([
  'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
]);

export function buildSitemapEntry(url: unknown, options: unknown): string {
  // Validate url
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('url must be a non-empty string');
  }

  // Validate options
  if (options !== undefined && options !== null && !isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }
  // Also handle null as "no options"
  if (options === null) {
    options = undefined;
  }

  const opts = options as Record<string, unknown> | undefined;

  let lastmod: string | undefined;
  let changefreq: string | undefined;
  let priority: number | undefined;

  if (opts !== undefined) {
    if ('lastmod' in opts && opts.lastmod !== undefined) {
      lastmod = opts.lastmod as string;
    }
    if ('changefreq' in opts && opts.changefreq !== undefined) {
      const cf = opts.changefreq as string;
      if (!VALID_CHANGEFREQ.has(cf)) {
        throw new RangeError('Invalid changefreq value');
      }
      changefreq = cf;
    }
    if ('priority' in opts && opts.priority !== undefined) {
      const p = opts.priority as number;
      if (typeof p !== 'number' || !Number.isFinite(p) || p < 0.0 || p > 1.0) {
        throw new RangeError('priority must be between 0.0 and 1.0');
      }
      priority = p;
    }
  }

  const escapedUrl = xmlEscape(url);
  let xml = `<url><loc>${escapedUrl}</loc>`;

  if (lastmod !== undefined) {
    xml += `<lastmod>${xmlEscape(lastmod)}</lastmod>`;
  }
  if (changefreq !== undefined) {
    xml += `<changefreq>${xmlEscape(changefreq)}</changefreq>`;
  }
  if (priority !== undefined) {
    xml += `<priority>${priority.toFixed(1)}</priority>`;
  }

  xml += `</url>`;
  return xml;
}