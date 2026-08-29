// bloom-deps:

export function parseUserAgent(ua: unknown): {
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  isMobile: boolean;
} {
  if (typeof ua !== 'string' || ua.length === 0) {
    throw new TypeError('ua must be a non-empty string');
  }

  let browser: string | null = null;
  let browserVersion: string | null = null;
  let os: string | null = null;
  let isMobile = false;

  // Detect browser
  if (ua.indexOf('Edg/') !== -1) {
    browser = 'Edge';
    const keyword = 'Edg/';
    const idx = ua.indexOf(keyword);
    if (idx !== -1) {
      const rest = ua.slice(idx + keyword.length);
      const match = rest.match(/^[\d.]+/);
      browserVersion = match ? match[0] : null;
    }
  } else if (ua.indexOf('Chrome/') !== -1 && ua.indexOf('Chromium/') === -1) {
    browser = 'Chrome';
    const keyword = 'Chrome/';
    const idx = ua.indexOf(keyword);
    if (idx !== -1) {
      const rest = ua.slice(idx + keyword.length);
      const match = rest.match(/^[\d.]+/);
      browserVersion = match ? match[0] : null;
    }
  } else if (ua.indexOf('Firefox/') !== -1) {
    browser = 'Firefox';
    const keyword = 'Firefox/';
    const idx = ua.indexOf(keyword);
    if (idx !== -1) {
      const rest = ua.slice(idx + keyword.length);
      const match = rest.match(/^[\d.]+/);
      browserVersion = match ? match[0] : null;
    }
  } else if (ua.indexOf('Safari/') !== -1 && ua.indexOf('Chrome/') === -1) {
    browser = 'Safari';
    const keyword = 'Safari/';
    const idx = ua.indexOf(keyword);
    if (idx !== -1) {
      const rest = ua.slice(idx + keyword.length);
      const match = rest.match(/^[\d.]+/);
      browserVersion = match ? match[0] : null;
    }
  } else if (ua.indexOf('Trident/') !== -1) {
    browser = 'IE';
    // For IE with Trident, version may be in 'rv:' or 'MSIE '
    // Extract version after 'Trident/'
    const keyword = 'Trident/';
    const idx = ua.indexOf(keyword);
    if (idx !== -1) {
      const rest = ua.slice(idx + keyword.length);
      const match = rest.match(/^[\d.]+/);
      browserVersion = match ? match[0] : null;
    }
  } else if (ua.indexOf('MSIE ') !== -1) {
    browser = 'IE';
    const keyword = 'MSIE ';
    const idx = ua.indexOf(keyword);
    if (idx !== -1) {
      const rest = ua.slice(idx + keyword.length);
      const match = rest.match(/^[\d.]+/);
      browserVersion = match ? match[0] : null;
    }
  }

  // Detect OS
  if (ua.indexOf('Android') !== -1) {
    os = 'Android';
    isMobile = true;
  } else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
    os = 'iOS';
    isMobile = true;
  } else if (ua.indexOf('Windows NT') !== -1) {
    os = 'Windows';
    isMobile = false;
  } else if (ua.indexOf('Macintosh') !== -1) {
    os = 'macOS';
    isMobile = false;
  } else if (ua.indexOf('Linux') !== -1) {
    os = 'Linux';
    isMobile = false;
  }

  return { browser, browserVersion, os, isMobile };
}