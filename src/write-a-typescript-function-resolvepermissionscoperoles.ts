// bloom-deps:

function resolvePermissionScope(roles: unknown, resource: unknown): string[] {
  // Type validation for roles
  if (!Array.isArray(roles)) {
    throw new TypeError('roles must be an array');
  }

  // Type validation for resource
  if (typeof resource !== 'string') {
    throw new TypeError('resource must be a string');
  }

  // Empty/whitespace validation for resource
  const trimmedResource = resource.trim();
  if (!trimmedResource) {
    throw new RangeError('resource must not be empty');
  }

  // Permission map
  const permissionMap: Record<string, string[]> = {
    'admin': ['read', 'write', 'delete', 'manage'],
    'editor': ['read', 'write'],
    'viewer': ['read'],
    'owner': ['read', 'write', 'delete', 'manage', 'transfer']
  };

  // Collect permissions from all roles
  const collectedPermissions = new Set<string>();

  for (const role of roles) {
    // Type validation for each role
    if (typeof role !== 'string') {
      throw new TypeError('each role must be a string');
    }

    // Empty/whitespace validation for each role
    const trimmedRole = role.trim();
    if (!trimmedRole) {
      throw new RangeError('each role must not be empty');
    }

    // Look up permissions for this role
    const permissions = permissionMap[trimmedRole];
    if (permissions) {
      for (const permission of permissions) {
        collectedPermissions.add(permission);
      }
    }
  }

  // Return sorted unique array
  return Array.from(collectedPermissions).sort();
}

export { resolvePermissionScope };