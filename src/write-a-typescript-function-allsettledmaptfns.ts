// bloom-deps:

async function allSettledMap<T>(
  fns: unknown
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>> {
  if (!Array.isArray(fns)) {
    throw new TypeError("fns must be an array");
  }

  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError(`Element at index ${i} must be a function`);
    }
  }

  const results: Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }> = new Array(fns.length);

  const promises = fns.map((fn, i) => {
    const p = (fn as () => Promise<T>)();
    p.catch(() => {});
    return Promise.race([p]).then(
      (value: T) => {
        results[i] = { status: 'fulfilled', value };
      },
      (reason: unknown) => {
        results[i] = { status: 'rejected', reason };
      }
    );
  });

  await Promise.all(promises);

  return results;
}

export { allSettledMap };