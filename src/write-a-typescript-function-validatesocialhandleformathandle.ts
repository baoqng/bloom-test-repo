// bloom-deps:

export function validateSocialHandleFormat(handle: unknown, platform: unknown): string {
  if (typeof handle !== 'string') {
    throw new TypeError('handle must be a string');
  }
  if (typeof platform !== 'string') {
    throw new TypeError('platform must be a string');
  }

  if (!handle.trim()) {
    throw new RangeError('handle must not be empty');
  }
  if (!platform.trim()) {
    throw new RangeError('platform must not be empty');
  }

  let trimmedHandle = handle.trim();
  const trimmedPlatform = platform.trim().toLowerCase();

  if (trimmedHandle.startsWith('@')) {
    trimmedHandle = trimmedHandle.slice(1);
  }

  if (!trimmedHandle) {
    throw new RangeError('handle must not be empty');
  }

  if (trimmedPlatform === 'twitter' || trimmedPlatform === 'x') {
    if (
      trimmedHandle.length < 1 ||
      trimmedHandle.length > 15 ||
      !/^[A-Za-z0-9_]+$/.test(trimmedHandle)
    ) {
      throw new RangeError('invalid Twitter/X handle');
    }
    return trimmedHandle;
  }

  if (trimmedPlatform === 'instagram') {
    if (
      trimmedHandle.length < 1 ||
      trimmedHandle.length > 30 ||
      !/^[A-Za-z0-9_.]+$/.test(trimmedHandle) ||
      trimmedHandle.startsWith('.') ||
      trimmedHandle.endsWith('.') ||
      trimmedHandle.includes('..')
    ) {
      throw new RangeError('invalid Instagram handle');
    }
    return trimmedHandle;
  }

  if (trimmedPlatform === 'github') {
    if (
      trimmedHandle.length < 1 ||
      trimmedHandle.length > 39 ||
      !/^[A-Za-z0-9-]+$/.test(trimmedHandle) ||
      trimmedHandle.startsWith('-') ||
      trimmedHandle.endsWith('-') ||
      trimmedHandle.includes('--')
    ) {
      throw new RangeError('invalid GitHub handle');
    }
    return trimmedHandle;
  }

  throw new RangeError(`unsupported platform: ${trimmedPlatform}`);
}