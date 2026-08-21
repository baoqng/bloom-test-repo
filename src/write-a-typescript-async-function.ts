// bloom-deps:

async function withDatabaseTransaction<T>(
  getClient: () => Promise<{ query: (sql: string) => Promise<unknown>; release: () => void }>,
  fn: (client: { query: (sql: string) => Promise<unknown> }) => Promise<T>
): Promise<T> {
  if (typeof getClient !== 'function') {
    throw new TypeError('getClient must be a function');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    let result: T;
    try {
      result = await fn(client);
    } catch (fnError) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // swallow rollback error, re-throw original
      }
      throw fnError;
    }

    await client.query('COMMIT');
    return result;
  } finally {
    client.release();
  }
}

export { withDatabaseTransaction };