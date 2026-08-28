// bloom-deps:

export function resolveCanonicalPath(path: unknown): string {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }
  if (path === '') {
    throw new RangeError('path must not be empty');
  }
  if (!path.startsWith('/')) {
    throw new RangeError('path must be absolute');
  }

  const trailingSlash = path.endsWith('/');

  const segments = path.split('/');
  const resolved: string[] = [];
  let lastSegmentWasDotOrDoubleDot = false;

  for (const segment of segments) {
    if (segment === '' || segment === '.') {
      if (segment === '.') {
        lastSegmentWasDotOrDoubleDot = true;
      }
      // skip empty segments
      continue;
    } else if (segment === '..') {
      lastSegmentWasDotOrDoubleDot = true;
      if (resolved.length > 0) {
        resolved.pop();
      }
      // do not go above root
    } else {
      lastSegmentWasDotOrDoubleDot = false;
      resolved.push(segment);
    }
  }

  const base = '/' + resolved.join('/');

  if (trailingSlash || lastSegmentWasDotOrDoubleDot) {
    if (!base.endsWith('/')) {
      return base + '/';
    }
  }

  return base;
}