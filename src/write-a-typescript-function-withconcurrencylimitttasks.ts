// bloom-deps:

export async function withConcurrencyLimit<T>(tasks: unknown, limit: unknown): Promise<T[]> {
  if (!Array.isArray(tasks) || tasks.some(t => typeof t !== 'function')) {
    throw new TypeError('tasks must be an array of functions');
  }

  if (
    typeof limit !== 'number' ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    throw new TypeError('limit must be a positive integer');
  }

  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;
  let activeCount = 0;

  return new Promise<T[]>((resolve, reject) => {
    let settled = false;
    let completedCount = 0;

    function onReject(err: unknown) {
      if (!settled) {
        settled = true;
        reject(err);
      }
    }

    function startNext() {
      while (activeCount < (limit as number) && nextIndex < tasks.length) {
        const index = nextIndex++;
        activeCount++;

        (async () => {
          try {
            const result = await (tasks[index] as () => Promise<T>)();
            results[index] = result;
            activeCount--;
            completedCount++;

            if (completedCount === tasks.length) {
              if (!settled) {
                settled = true;
                resolve(results);
              }
            } else {
              startNext();
            }
          } catch (err) {
            activeCount--;
            onReject(err);
            startNext();
          }
        })();
      }
    }

    if (tasks.length === 0) {
      resolve(results);
      return;
    }

    startNext();
  });
}