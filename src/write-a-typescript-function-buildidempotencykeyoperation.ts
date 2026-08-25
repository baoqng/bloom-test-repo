// bloom-deps:

function buildIdempotencyKey(operation: unknown, resourceId: unknown, clientId: unknown): string {
  if (typeof operation !== "string" || operation.length === 0) {
    throw new TypeError("operation must be a non-empty string");
  }
  if (typeof resourceId !== "string" || resourceId.length === 0) {
    throw new TypeError("resourceId must be a non-empty string");
  }
  if (typeof clientId !== "string" || clientId.length === 0) {
    throw new TypeError("clientId must be a non-empty string");
  }
  if (!/^[A-Za-z0-9_]+$/.test(operation)) {
    throw new SyntaxError("operation must be alphanumeric and underscores only");
  }

  const encodedClientId = encodeURIComponent(clientId);
  const encodedOperation = encodeURIComponent(operation);
  const encodedResourceId = encodeURIComponent(resourceId);

  return `${encodedClientId}:${encodedOperation}:${encodedResourceId}`;
}

export { buildIdempotencyKey };