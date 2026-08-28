// bloom-deps:

function buildEventKey(topic: unknown, partitionKey: unknown, sequence: unknown): string {
  if (typeof topic !== 'string') {
    throw new TypeError('topic must be a string');
  }
  if (typeof partitionKey !== 'string') {
    throw new TypeError('partitionKey must be a string');
  }
  if (typeof sequence !== 'number') {
    throw new TypeError('sequence must be a number');
  }

  const trimmedTopic = topic.trim();
  if (trimmedTopic.length === 0) {
    throw new RangeError('topic must not be empty');
  }

  const trimmedPartitionKey = partitionKey.trim();
  if (trimmedPartitionKey.length === 0) {
    throw new RangeError('partitionKey must not be empty');
  }

  if (!Number.isFinite(sequence) || !Number.isInteger(sequence)) {
    throw new TypeError('sequence must be a finite integer');
  }

  if (sequence < 0) {
    throw new RangeError('sequence must be non-negative');
  }

  if (trimmedTopic.indexOf('/') !== -1) {
    throw new RangeError('topic must not contain slashes');
  }

  if (trimmedPartitionKey.indexOf('#') !== -1) {
    throw new RangeError('partitionKey must not contain hash signs');
  }

  return `${trimmedTopic}/${trimmedPartitionKey}#${sequence}`;
}

export { buildEventKey };