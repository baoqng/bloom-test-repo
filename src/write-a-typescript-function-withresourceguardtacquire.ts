// bloom-deps:

export async function withResourceGuard<T>(
  acquire: () => Promise<unknown>,
  release: (resource: unknown) => Promise<void>,
  fn: (resource: unknown) => Promise<T>
): Promise<T> {
  if (typeof acquire !== "function") {
    throw new TypeError("acquire must be a function");
  }
  if (typeof release !== "function") {
    throw new TypeError("release must be a function");
  }
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  const resource = await acquire();

  let fnResult: T;
  let fnError: unknown;
  let fnThrew = false;

  try {
    fnResult = await fn(resource);
  } catch (err) {
    fnError = err;
    fnThrew = true;
  }

  if (fnThrew) {
    // fn threw — call release, suppress release errors, rethrow fn error
    try {
      await release(resource);
    } catch {
      // suppress release error
    }
    throw fnError;
  } else {
    // fn succeeded — call release, let release errors propagate
    await release(resource);
    return fnResult!;
  }
}