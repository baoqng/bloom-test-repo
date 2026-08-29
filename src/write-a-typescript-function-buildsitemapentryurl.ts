// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Check if the direct prototype is Object.prototype
  return Object.getPrototypeOf(value) === Object.prototype;
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
  // Validate url
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('url must be a non-empty string');
  }

  // Validate options
  if (options !== undefined && options !== null && !isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }

  const escapedUrl = xmlEscape(url);
  let inner = `<loc>${escapedUrl}</loc>`;

  if (options !== null && options !== undefined && isPlainObject(options)) {
    const opts = options as Record<string, unknown>;

    // Handle lastmod
    if ('lastmod' in opts && opts['lastmod'] !== undefined) {
      const lastmod = opts['lastmod'];
      if (typeof lastmod === 'string') {
        inner += `<lastmod>${xmlEscape(lastmod)}</lastmod>`;
      }
    }

    // Handle changefreq
    if ('changefreq' in opts && opts['changefreq'] !== undefined) {
      const changefreq = opts['changefreq'];
      const validValues = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      if (typeof changefreq !== 'string' || !validValues.includes(changefreq)) {
        throw new RangeError('Invalid changefreq value');
      }
      inner += `<changefreq>${changefreq}</changefreq>`;
    }

    // Handle priority
    if ('priority' in opts && opts['priority'] !== undefined) {
      const priority = opts['priority'];
      if (typeof priority !== 'number' || !Number.isFinite(priority)) {
        throw new RangeError('priority must be between 0.0 and 1.0');
      }
      if (priority < 0.0 || priority > 1.0) {
        throw new RangeError('priority must be between 0.0 and 1.0');
      }
      inner += `<priority>${priority.toFixed(1)}</priority>`;
    }
  }

  return `<url>${inner}</url>`;
}