// bloom-deps:

function shuffle<T>(items: T[]): T[] {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  if (items.length === 0) {
    return [];
  }

  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

export { shuffle };