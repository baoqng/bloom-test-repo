// bloom-deps:

function buildOAuthRedirect(
  baseUrl: unknown,
  clientId: unknown,
  redirectUri: unknown,
  scopes: unknown,
  state: unknown
): string {
  // Type validation
  if (typeof baseUrl !== 'string') {
    throw new TypeError('baseUrl must be a string');
  }
  if (typeof clientId !== 'string') {
    throw new TypeError('clientId must be a string');
  }
  if (typeof redirectUri !== 'string') {
    throw new TypeError('redirectUri must be a string');
  }
  if (!Array.isArray(scopes)) {
    throw new TypeError('scopes must be an array');
  }
  if (typeof state !== 'string') {
    throw new TypeError('state must be a string');
  }

  // Empty/whitespace validation
  if (!baseUrl.trim()) {
    throw new RangeError('baseUrl must not be empty');
  }
  if (!clientId.trim()) {
    throw new RangeError('clientId must not be empty');
  }
  if (!redirectUri.trim()) {
    throw new RangeError('redirectUri must not be empty');
  }
  if (scopes.length === 0) {
    throw new RangeError('scopes must not be empty');
  }
  if (!state.trim()) {
    throw new RangeError('state must not be empty');
  }

  // Scope validation
  for (const scope of scopes) {
    if (typeof scope !== 'string') {
      throw new TypeError('each scope must be a string');
    }
    if (!scope.trim()) {
      throw new RangeError('each scope must not be empty');
    }
  }

  // Build the URL
  const trimmedBaseUrl = baseUrl.trim();
  const baseUrlWithoutTrailingSlash = trimmedBaseUrl.endsWith('/')
    ? trimmedBaseUrl.slice(0, -1)
    : trimmedBaseUrl;

  const params = new URLSearchParams();
  params.append('response_type', 'code');
  params.append('client_id', clientId.trim());
  params.append('redirect_uri', redirectUri.trim());
  params.append('scope', scopes.map((s: string) => s.trim()).join(' '));
  params.append('state', state.trim());

  const queryString = params
    .toString()
    .replace(/\+/g, '%20');

  return `${baseUrlWithoutTrailingSlash}?${queryString}`;
}

export { buildOAuthRedirect };