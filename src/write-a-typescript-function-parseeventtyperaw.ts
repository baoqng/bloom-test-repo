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
  let searchFrom = 0;
  while (true) {
    const idx = raw.indexOf('.', searchFrom);
    if (idx === -1) break;
    delimCount++;
    searchFrom = idx + 1;
  }

  const segmentCount = delimCount + 1;

  if (segmentCount < 2) {
    throw new RangeError('raw must have at least two dot-separated segments');
  }

  if (segmentCount > 3) {
    throw new RangeError('raw must not have more than three dot-separated segments');
  }

  // Extract segments using indexOf+slice to split on first separator only
  const firstDotIdx = raw.indexOf('.');
  const domain = raw.slice(0, firstDotIdx).trim();
  const rest = raw.slice(firstDotIdx + 1);

  let action: string;
  let subAction: string | null = null;

  if (segmentCount === 2) {
    action = rest.trim();
  } else {
    // segmentCount === 3
    const secondDotIdx = rest.indexOf('.');
    action = rest.slice(0, secondDotIdx).trim();
    subAction = rest.slice(secondDotIdx + 1).trim();
  }

  // Validate each segment is non-empty after trimming
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