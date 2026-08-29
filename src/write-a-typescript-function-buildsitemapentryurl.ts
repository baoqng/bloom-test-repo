// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Check if the direct prototype is Object.prototype or null (Object.create(null))
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildSitemapEntry(url: unknown, options: unknown): string {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('url must be a non-empty string');
  }

  if (options !== undefined && options !== null && !isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }

  // Also handle null options as no options
  const opts = (options !== undefined && options !== null) ? options as Record<string, unknown> : {};

  const validChangefreqs = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']);

  let lastmod: string | undefined;
  let changefreq: string | undefined;
  let priority: number | undefined;

  if ('lastmod' in opts && opts['lastmod'] !== undefined) {
    lastmod = String(opts['lastmod']);
  }

  if ('changefreq' in opts && opts['changefreq'] !== undefined) {
    const cf = opts['changefreq'];
    if (typeof cf !== 'string' || !validChangefreqs.has(cf)) {
      throw new RangeError('Invalid changefreq value');
    }
    changefreq = cf;
  }

  if ('priority' in opts && opts['priority'] !== undefined) {
    const p = opts['priority'];
    if (typeof p !== 'number') {
      throw new RangeError('priority must be between 0.0 and 1.0');
    }
    if (p < 0.0 || p > 1.0) {
      throw new RangeError('priority must be between 0.0 and 1.0');
    }
    priority = p;
  }

  const escapedUrl = xmlEscape(url);

  let result = `<url><loc>${escapedUrl}</loc>`;

  if (lastmod !== undefined) {
    result += `<lastmod>${lastmod}</lastmod>`;
  }

  if (changefreq !== undefined) {
    result += `<changefreq>${changefreq}</changefreq>`;
  }

  if (priority !== undefined) {
    result += `<priority>${priority.toFixed(1)}</priority>`;
  }

  result += `</url>`;

  return result;
}