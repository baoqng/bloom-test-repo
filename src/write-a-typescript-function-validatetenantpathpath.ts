// bloom-deps:

function validateTenantPath(path: unknown): { tenant: string; resource: string; id: string } {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  const trimmed = path.trim();
  if (trimmed.length === 0) {
    throw new RangeError('path must not be empty');
  }

  // Count '/' occurrences explicitly using indexOf+slice
  let slashCount = 0;
  let searchStr = trimmed;
  let searchPos = 0;
  while (true) {
    const idx = searchStr.indexOf('/', searchPos);
    if (idx === -1) break;
    slashCount++;
    searchPos = idx + 1;
  }

  if (slashCount !== 2) {
    throw new RangeError('path must have exactly three segments');
  }

  // Use indexOf+slice to extract segments one at a time
  const firstSlash = trimmed.indexOf('/');
  const tenantRaw = trimmed.slice(0, firstSlash);
  const remainder = trimmed.slice(firstSlash + 1);

  const secondSlash = remainder.indexOf('/');
  const resourceRaw = remainder.slice(0, secondSlash);
  const idRaw = remainder.slice(secondSlash + 1);

  const tenant = tenantRaw.trim();
  const resource = resourceRaw.trim();
  const id = idRaw.trim();

  if (tenant.length === 0) {
    throw new RangeError('tenant must not be empty');
  }

  if (resource.length === 0) {
    throw new RangeError('resource must not be empty');
  }

  if (id.length === 0) {
    throw new RangeError('id must not be empty');
  }

  // Validate tenant: lowercase letters, digits, hyphens only, must start with a letter
  if (!/^[a-z][a-z0-9-]*$/.test(tenant)) {
    throw new RangeError('tenant format is invalid');
  }

  // Validate each label of tenant for hyphens (check inside label loop)
  const tenantLabels = tenant.split('.');
  for (const label of tenantLabels) {
    if (label.startsWith('-') || label.endsWith('-')) {
      throw new RangeError('tenant format is invalid');
    }
  }

  // Validate resource: lowercase letters only
  if (!/^[a-z]+$/.test(resource)) {
    throw new RangeError('resource must contain only lowercase letters');
  }

  // Validate id: letters, digits, hyphens, and underscores only
  if (!/^[A-Za-z0-9\-_]+$/.test(id)) {
    throw new RangeError('id format is invalid');
  }

  return { tenant, resource, id };
}

export { validateTenantPath };