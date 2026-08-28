// bloom-deps:

function buildJsonPatchOp(
  op: unknown,
  path: unknown,
  value?: unknown
): { op: string; path: string; value?: unknown } {
  if (typeof op !== "string") {
    throw new TypeError("op must be a string");
  }
  if (typeof path !== "string") {
    throw new TypeError("path must be a string");
  }

  const allowedOps = ["add", "remove", "replace", "move", "copy", "test"];
  if (!allowedOps.includes(op)) {
    throw new RangeError(
      `op must be one of: ${allowedOps.join(", ")}; received '${op}'`
    );
  }

  if (!path.startsWith("/")) {
    throw new RangeError("path must start with '/'");
  }

  if (op === "remove" && value !== undefined) {
    throw new RangeError("op 'remove' must not include a value");
  }

  if (["add", "replace", "test"].includes(op) && value === undefined) {
    throw new RangeError(`op '${op}' requires a value`);
  }

  if (value !== undefined) {
    return { op, path, value };
  }

  return { op, path };
}

export { buildJsonPatchOp };