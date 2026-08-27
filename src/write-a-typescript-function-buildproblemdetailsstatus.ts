// bloom-deps:

export function buildProblemDetails(
  status: unknown,
  title: unknown,
  detail: unknown,
  instance?: unknown
): { type: string; status: number; title: string; detail: string; instance?: string } {
  if (typeof status !== 'number') {
    throw new TypeError('status must be a number');
  }
  if (typeof title !== 'string') {
    throw new TypeError('title must be a string');
  }
  if (typeof detail !== 'string') {
    throw new TypeError('detail must be a string');
  }

  if (!Number.isFinite(status) || !Number.isInteger(status) || status < 100 || status > 599) {
    throw new RangeError('status must be an integer between 100 and 599');
  }

  if (title.trim().length === 0) {
    throw new RangeError('title must not be empty');
  }

  if (detail.trim().length === 0) {
    throw new RangeError('detail must not be empty');
  }

  if (instance !== undefined) {
    if (typeof instance !== 'string') {
      throw new TypeError('instance must be a string');
    }
    if (instance.trim().length === 0) {
      throw new RangeError('instance must not be empty');
    }
  }

  const result: { type: string; status: number; title: string; detail: string; instance?: string } = {
    type: 'about:blank',
    status: status,
    title: title.trim(),
    detail: detail.trim(),
  };

  if (instance !== undefined) {
    result.instance = (instance as string).trim();
  }

  return result;
}