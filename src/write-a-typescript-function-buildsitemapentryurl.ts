// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
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

const VALID_CHANGEFREQ = new Set([
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
]);

export function buildSitemapEntry(url: unknown, options: unknown): string {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('url must be a non-empty string');
  }

  if (options !== undefined && !isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }

  const opts = (options ?? {}) as Record<string, unknown>;

  let lastmod: string | undefined;
  let changefreq: string | undefined;
  let priority: number | undefined;

  if ('lastmod' in opts && opts['lastmod'] !== undefined) {
    lastmod = opts['lastmod'] as string;
  }

  if ('changefreq' in opts && opts['changefreq'] !== undefined) {
    changefreq = opts['changefreq'] as string;
    if (!VALID_CHANGEFREQ.has(changefreq)) {
      throw new RangeError('Invalid changefreq value');
    }
  }

  if ('priority' in opts && opts['priority'] !== undefined) {
    priority = opts['priority'] as number;
    if (typeof priority !== 'number' || priority < 0.0 || priority > 1.0) {
      throw new RangeError('priority must be between 0.0 and 1.0');
    }
  }

  const escapedUrl = xmlEscape(url);

  let inner = `<loc>${escapedUrl}</loc>`;

  if (lastmod !== undefined) {
    inner += `<lastmod>${xmlEscape(String(lastmod))}</lastmod>`;
  }

  if (changefreq !== undefined) {
    inner += `<changefreq>${xmlEscape(changefreq)}</changefreq>`;
  }

  if (priority !== undefined) {
    inner += `<priority>${priority.toFixed(1)}</priority>`;
  }

  return `<url>${inner}</url>`;
}