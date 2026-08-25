// bloom-deps:

function buildRequestId(service: unknown, timestamp: unknown): string {
  if (typeof service !== "string" || service.trim().length === 0) {
    throw new TypeError("service must be a non-empty string");
  }

  if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
    throw new TypeError("timestamp must be a finite number");
  }

  if (timestamp < 0 || !Number.isInteger(timestamp)) {
    throw new RangeError("timestamp must be a non-negative integer");
  }

  const trimmedService = service.trim().toLowerCase();
  const checksumValue = (trimmedService.length * 31 + timestamp) % 2147483647;
  const base36Full = checksumValue.toString(36);
  const checksum = base36Full.length >= 6
    ? base36Full.slice(-6)
    : base36Full.padStart(6, "0");

  return `${trimmedService}-${timestamp}-${checksum}`;
}

export { buildRequestId };