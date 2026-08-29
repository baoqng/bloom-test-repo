// bloom-deps:

export interface EventType {
  domain: string;
  action: string;
  subAction: string | null;
}

export function parseEventType(raw: string): EventType {
  if (typeof raw !== 'string') {
    throw new TypeError('raw must be a string');
  }

  if (raw.trim().length === 0) {
    throw new RangeError('raw must not be empty or whitespace-only');
  }

  // Count delimiter occurrences explicitly using indexOf
  let delimCount = 0;
  let searchPos = 0;
  while (true) {
    const idx = raw.indexOf('.', searchPos);
    if (idx === -1) break;
    delimCount++;
    searchPos = idx + 1;
  }

  const segmentCount = delimCount + 1;

  if (segmentCount < 2) {
    throw new RangeError('raw must have at least two dot-separated segments');
  }

  if (segmentCount > 3) {
    throw new RangeError('raw must have no more than three dot-separated segments');
  }

  // Extract segments using indexOf+slice, not split destructuring
  const firstDotIdx = raw.indexOf('.');
  const domain = raw.slice(0, firstDotIdx).trim();

  let action: string;
  let subAction: string | null = null;

  if (segmentCount === 2) {
    action = raw.slice(firstDotIdx + 1).trim();
  } else {
    // segmentCount === 3
    const remainder = raw.slice(firstDotIdx + 1);
    const secondDotIdx = remainder.indexOf('.');
    action = remainder.slice(0, secondDotIdx).trim();
    subAction = remainder.slice(secondDotIdx + 1).trim();
  }

  // Validate each segment after trimming
  if (domain.length === 0) {
    throw new RangeError('domain segment must not be empty or whitespace-only');
  }

  if (action.length === 0) {
    throw new RangeError('action segment must not be empty or whitespace-only');
  }

  if (subAction !== null && subAction.length === 0) {
    throw new RangeError('subAction segment must not be empty or whitespace-only');
  }

  return { domain, action, subAction };
}