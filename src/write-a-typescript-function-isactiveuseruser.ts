// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function isActiveUser(user: unknown): boolean {
  try {
    if (!isPlainObject(user)) return false;
    if (!Object.prototype.hasOwnProperty.call(user, 'status')) return false;
    return user['status'] === 'active';
  } catch {
    return false;
  }
}