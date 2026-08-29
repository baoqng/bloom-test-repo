// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
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

function buildSitemapEntry(url: unknown, options: unknown): string {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('url must be a non-empty string');
  }
  
  if (options !== undefined && !isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }
  
  const opts = options as Record<string, unknown> || {};
  
  let lastmod = '';
  let changefreq = '';
  let priority = '';
  
  if ('lastmod' in opts && opts.lastmod !== undefined) {
    lastmod = opts.lastmod as string;
  }
  
  if ('changefreq' in opts && opts.changefreq !== undefined) {
    const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    const cf = opts.changefreq as string;
    if (validChangefreqs.indexOf(cf) === -1) {
      throw new RangeError('Invalid changefreq value');
    }
    changefreq = cf;
  }
  
  if ('priority' in opts && opts.priority !== undefined) {
    const p = opts.priority as number;
    if (typeof p !== 'number' || !Number.isFinite(p) || p < 0.0 || p > 1.0) {
      throw new RangeError('priority must be between 0.0 and 1.0');
    }
    priority = p.toFixed(1);
  }
  
  const escapedUrl = xmlEscape(url);
  
  let entry = `<url><loc>${escapedUrl}</loc>`;
  
  if (lastmod) {
    entry += `<lastmod>${xmlEscape(lastmod)}</lastmod>`;
  }
  
  if (changefreq) {
    entry += `<changefreq>${xmlEscape(changefreq)}</changefreq>`;
  }
  
  if (priority) {
    entry += `<priority>${priority}</priority>`;
  }
  
  entry += '</url>';
  
  return entry;
}

export { buildSitemapEntry };