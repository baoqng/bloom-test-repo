// bloom-deps:

import { describe, it, expect } from 'vitest';

// Inline implementation for testing
function validateSocialHandleFormat(handle: unknown, platform: unknown): string {
  if (typeof handle !== 'string') throw new TypeError('handle must be a string');
  if (typeof platform !== 'string') throw new TypeError('platform must be a string');

  if (!handle.trim()) throw new RangeError('handle must not be empty');
  if (!platform.trim()) throw new RangeError('platform must not be empty');

  let trimmedHandle = handle.trim();
  const trimmedPlatform = platform.trim().toLowerCase();

  if (trimmedHandle.startsWith('@')) {
    trimmedHandle = trimmedHandle.slice(1);
    if (!trimmedHandle) throw new RangeError('handle must not be empty');
  }

  if (trimmedPlatform === 'twitter' || trimmedPlatform === 'x') {
    if (!/^[A-Za-z0-9_]{1,15}$/.test(trimmedHandle)) {
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
      /\.\./.test(trimmedHandle)
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
      /--/.test(trimmedHandle)
    ) {
      throw new RangeError('invalid GitHub handle');
    }
    return trimmedHandle;
  }

  throw new RangeError(`unsupported platform: ${trimmedPlatform}`);
}

describe('validateSocialHandleFormat', () => {
  // --- TypeError: handle not a string ---
  describe('handle type validation', () => {
    it('throws TypeError if handle is null', () => {
      expect(() => validateSocialHandleFormat(null, 'twitter')).toThrow(TypeError);
      expect(() => validateSocialHandleFormat(null, 'twitter')).toThrow('handle must be a string');
    });

    it('throws TypeError if handle is a number', () => {
      expect(() => validateSocialHandleFormat(123, 'twitter')).toThrow(TypeError);
      expect(() => validateSocialHandleFormat(123, 'twitter')).toThrow('handle must be a string');
    });

    it('throws TypeError if handle is undefined', () => {
      expect(() => validateSocialHandleFormat(undefined, 'twitter')).toThrow(TypeError);
      expect(() => validateSocialHandleFormat(undefined, 'twitter')).toThrow('handle must be a string');
    });

    it('throws TypeError if handle is an object', () => {
      expect(() => validateSocialHandleFormat({}, 'twitter')).toThrow(TypeError);
      expect(() => validateSocialHandleFormat({}, 'twitter')).toThrow('handle must be a string');
    });

    it('throws TypeError if handle is a boolean', () => {
      expect(() => validateSocialHandleFormat(true, 'twitter')).toThrow(TypeError);
      expect(() => validateSocialHandleFormat(true, 'twitter')).toThrow('handle must be a string');
    });
  });

  // --- TypeError: platform not a string ---
  describe('platform type validation', () => {
    it('throws TypeError if platform is null', () => {
      expect(() => validateSocialHandleFormat('user', null)).toThrow(TypeError);
      expect(() => validateSocialHandleFormat('user', null)).toThrow('platform must be a string');
    });

    it('throws TypeError if platform is a number', () => {
      expect(() => validateSocialHandleFormat('user', 42)).toThrow(TypeError);
      expect(() => validateSocialHandleFormat('user', 42)).toThrow('platform must be a string');
    });

    it('throws TypeError if platform is undefined', () => {
      expect(() => validateSocialHandleFormat('user', undefined)).toThrow(TypeError);
      expect(() => validateSocialHandleFormat('user', undefined)).toThrow('platform must be a string');
    });

    it('throws TypeError if platform is an object', () => {
      expect(() => validateSocialHandleFormat('user', {})).toThrow(TypeError);
      expect(() => validateSocialHandleFormat('user', {})).toThrow('platform must be a string');
    });

    it('throws TypeError if platform is a boolean', () => {
      expect(() => validateSocialHandleFormat('user', false)).toThrow(TypeError);
      expect(() => validateSocialHandleFormat('user', false)).toThrow('platform must be a string');
    });
  });

  // --- handle type is checked before platform type ---
  it('throws TypeError for handle before checking platform type', () => {
    expect(() => validateSocialHandleFormat(123, 456)).toThrow('handle must be a string');
  });

  // --- RangeError: handle empty or whitespace ---
  describe('handle empty/whitespace validation', () => {
    it('throws RangeError if handle is empty string', () => {
      expect(() => validateSocialHandleFormat('', 'twitter')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('', 'twitter')).toThrow('handle must not be empty');
    });

    it('throws RangeError if handle is whitespace only', () => {
      expect(() => validateSocialHandleFormat('   ', 'twitter')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('   ', 'twitter')).toThrow('handle must not be empty');
    });

    it('throws RangeError if handle is tab characters only', () => {
      expect(() => validateSocialHandleFormat('\t\n', 'twitter')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('\t\n', 'twitter')).toThrow('handle must not be empty');
    });
  });

  // --- RangeError: platform empty or whitespace ---
  describe('platform empty/whitespace validation', () => {
    it('throws RangeError if platform is empty string', () => {
      expect(() => validateSocialHandleFormat('user', '')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('user', '')).toThrow('platform must not be empty');
    });

    it('throws RangeError if platform is whitespace only', () => {
      expect(() => validateSocialHandleFormat('user', '   ')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('user', '   ')).toThrow('platform must not be empty');
    });
  });

  // --- Normalization: handle whitespace trimmed ---
  describe('handle whitespace trimming', () => {
    it('trims leading and trailing whitespace from handle', () => {
      expect(validateSocialHandleFormat('  user123  ', 'twitter')).toBe('user123');
    });

    it('trims whitespace before stripping @', () => {
      expect(validateSocialHandleFormat('  @user123  ', 'twitter')).toBe('user123');
    });
  });

  // --- Normalization: platform whitespace trimmed and lowercased ---
  describe('platform whitespace trimming and case normalization', () => {
    it('trims leading/trailing whitespace from platform', () => {
      expect(validateSocialHandleFormat('user123', '  twitter  ')).toBe('user123');
    });

    it('lowercases platform before matching', () => {
      expect(validateSocialHandleFormat('user123', 'TWITTER')).toBe('user123');
    });

    it('handles mixed case platform', () => {
      expect(validateSocialHandleFormat('user123', 'Twitter')).toBe('user123');
    });

    it('handles uppercase X platform', () => {
      expect(validateSocialHandleFormat('user123', 'X')).toBe('user123');
    });

    it('handles mixed case Instagram', () => {
      expect(validateSocialHandleFormat('user_name', 'Instagram')).toBe('user_name');
    });

    it('handles mixed case GitHub', () => {
      expect(validateSocialHandleFormat('user-name', 'GitHub')).toBe('user-name');
    });
  });

  // --- Normalization: leading '@' stripped from handle ---
  describe('leading @ stripping', () => {
    it('strips leading @ from handle', () => {
      expect(validateSocialHandleFormat('@user123', 'twitter')).toBe('user123');
    });

    it('does not strip @ in middle of handle', () => {
      expect(() => validateSocialHandleFormat('user@name', 'twitter')).toThrow('invalid Twitter/X handle');
    });

    it('strips @ and validates the remaining handle', () => {
      expect(validateSocialHandleFormat('@validuser', 'twitter')).toBe('validuser');
    });

    it('strips @ for instagram handle', () => {
      expect(validateSocialHandleFormat('@user.name', 'instagram')).toBe('user.name');
    });

    it('strips @ for github handle', () => {
      expect(validateSocialHandleFormat('@user-name', 'github')).toBe('user-name');
    });
  });

  // --- Twitter/X platform validation ---
  describe('Twitter/X platform', () => {
    describe('valid handles', () => {
      it('accepts simple username', () => {
        expect(validateSocialHandleFormat('user', 'twitter')).toBe('user');
      });

      it('accepts username with underscores', () => {
        expect(validateSocialHandleFormat('user_name', 'twitter')).toBe('user_name');
      });

      it('accepts username with digits', () => {
        expect(validateSocialHandleFormat('user123', 'twitter')).toBe('user123');
      });

      it('accepts max length 15 char handle', () => {
        expect(validateSocialHandleFormat('a'.repeat(15), 'twitter')).toBe('a'.repeat(15));
      });

      it('accepts single char handle', () => {
        expect(validateSocialHandleFormat('a', 'twitter')).toBe('a');
      });

      it('accepts handle for platform x', () => {
        expect(validateSocialHandleFormat('user123', 'x')).toBe('user123');
      });

      it('accepts all uppercase handle', () => {
        expect(validateSocialHandleFormat('USERNAME', 'twitter')).toBe('USERNAME');
      });

      it('accepts handle with @ prefix using x platform', () => {
        expect(validateSocialHandleFormat('@user_123', 'x')).toBe('user_123');
      });
    });

    describe('invalid handles', () => {
      it('throws RangeError if handle exceeds 15 chars', () => {
        expect(() => validateSocialHandleFormat('a'.repeat(16), 'twitter')).toThrow(RangeError);
        expect(() => validateSocialHandleFormat('a'.repeat(16), 'twitter')).toThrow('invalid Twitter/X handle');
      });

      it('throws RangeError if handle contains a dot', () => {
        expect(() => validateSocialHandleFormat('user.name', 'twitter')).toThrow('invalid Twitter/X handle');
      });

      it('throws RangeError if handle contains a hyphen', () => {
        expect(() => validateSocialHandleFormat('user-name', 'twitter')).toThrow('invalid Twitter/X handle');
      });

      it('throws RangeError if handle contains special characters', () => {
        expect(() => validateSocialHandleFormat('user!', 'twitter')).toThrow('invalid Twitter/X handle');
      });

      it('throws RangeError if handle contains spaces', () => {
        expect(() => validateSocialHandleFormat('user name', 'twitter')).toThrow('invalid Twitter/X handle');
      });

      it('throws RangeError for x platform with invalid chars', () => {
        expect(() => validateSocialHandleFormat('user.name', 'x')).toThrow('invalid Twitter/X handle');
      });

      it('throws RangeError for x platform exceeding 15 chars', () => {
        expect(() => validateSocialHandleFormat('a'.repeat(16), 'x')).toThrow('invalid Twitter/X handle');
      });

      it('throws RangeError if handle contains @', () => {
        expect(() => validateSocialHandleFormat('user@123', 'twitter')).toThrow('invalid Twitter/X handle');
      });
    });
  });

  // --- Instagram platform validation ---
  describe('Instagram platform', () => {
    describe('valid handles', () => {
      it('accepts simple username', () => {
        expect(validateSocialHandleFormat('user', 'instagram')).toBe('user');
      });

      it('accepts username with underscores and dots', () => {
        expect(validateSocialHandleFormat('user.name_here', 'instagram')).toBe('user.name_here');
      });

      it('accepts max length 30 char handle', () => {
        expect(validateSocialHandleFormat('a'.repeat(30), 'instagram')).toBe('a'.repeat(30));
      });

      it('accepts single char handle', () => {
        expect(validateSocialHandleFormat('a', 'instagram')).toBe('a');
      });

      it('accepts handle with digits', () => {
        expect(validateSocialHandleFormat('user123', 'instagram')).toBe('user123');
      });

      it('accepts handle with dot in the middle', () => {
        expect(validateSocialHandleFormat('user.name', 'instagram')).toBe('user.name');
      });
    });

    describe('invalid handles', () => {
      it('throws RangeError if handle exceeds 30 chars', () => {
        expect(() => validateSocialHandleFormat('a'.repeat(31), 'instagram')).toThrow(RangeError);
        expect(() => validateSocialHandleFormat('a'.repeat(31), 'instagram')).toThrow('invalid Instagram handle');
      });

      it('throws RangeError if handle starts with a dot', () => {
        expect(() => validateSocialHandleFormat('.username', 'instagram')).toThrow('invalid Instagram handle');
      });

      it('throws RangeError if handle ends with a dot', () => {
        expect(() => validateSocialHandleFormat('username.', 'instagram')).toThrow('invalid Instagram handle');
      });

      it('throws RangeError if handle contains consecutive dots', () => {
        expect(() => validateSocialHandleFormat('user..name', 'instagram')).toThrow('invalid Instagram handle');
      });

      it('throws RangeError if handle contains hyphens', () => {
        expect(() => validateSocialHandleFormat('user-name', 'instagram')).toThrow('invalid Instagram handle');
      });

      it('throws RangeError if handle contains special characters', () => {
        expect(() => validateSocialHandleFormat('user!name', 'instagram')).toThrow('invalid Instagram handle');
      });

      it('throws RangeError if handle contains spaces', () => {
        expect(() => validateSocialHandleFormat('user name', 'instagram')).toThrow('invalid Instagram handle');
      });
    });
  });

  // --- GitHub platform validation ---
  describe('GitHub platform', () => {
    describe('valid handles', () => {
      it('accepts simple username', () => {
        expect(validateSocialHandleFormat('user', 'github')).toBe('user');
      });

      it('accepts username with hyphens', () => {
        expect(validateSocialHandleFormat('user-name', 'github')).toBe('user-name');
      });

      it('accepts max length 39 char handle', () => {
        expect(validateSocialHandleFormat('a'.repeat(39), 'github')).toBe('a'.repeat(39));
      });

      it('accepts single char handle', () => {
        expect(validateSocialHandleFormat('a', 'github')).toBe('a');
      });

      it('accepts handle with digits', () => {
        expect(validateSocialHandleFormat('user123', 'github')).toBe('user123');
      });

      it('accepts hyphen in middle', () => {
        expect(validateSocialHandleFormat('my-user-name', 'github')).toBe('my-user-name');
      });
    });

    describe('invalid handles', () => {
      it('throws RangeError if handle exceeds 39 chars', () => {
        expect(() => validateSocialHandleFormat('a'.repeat(40), 'github')).toThrow(RangeError);
        expect(() => validateSocialHandleFormat('a'.repeat(40), 'github')).toThrow('invalid GitHub handle');
      });

      it('throws RangeError if handle starts with a hyphen', () => {
        expect(() => validateSocialHandleFormat('-username', 'github')).toThrow('invalid GitHub handle');
      });

      it('throws RangeError if handle ends with a hyphen', () => {
        expect(() => validateSocialHandleFormat('username-', 'github')).toThrow('invalid GitHub handle');
      });

      it('throws RangeError if handle contains consecutive hyphens', () => {
        expect(() => validateSocialHandleFormat('user--name', 'github')).toThrow('invalid GitHub handle');
      });

      it('throws RangeError if handle contains dots', () => {
        expect(() => validateSocialHandleFormat('user.name', 'github')).toThrow('invalid GitHub handle');
      });

      it('throws RangeError if handle contains underscores', () => {
        expect(() => validateSocialHandleFormat('user_name', 'github')).toThrow('invalid GitHub handle');
      });

      it('throws RangeError if handle contains special characters', () => {
        expect(() => validateSocialHandleFormat('user!', 'github')).toThrow('invalid GitHub handle');
      });

      it('throws RangeError if handle contains spaces', () => {
        expect(() => validateSocialHandleFormat('user name', 'github')).toThrow('invalid GitHub handle');
      });
    });
  });

  // --- Unsupported platform ---
  describe('unsupported platform', () => {
    it('throws RangeError for unsupported platform "facebook"', () => {
      expect(() => validateSocialHandleFormat('user', 'facebook')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('user', 'facebook')).toThrow('unsupported platform: facebook');
    });

    it('throws RangeError for unsupported platform "tiktok"', () => {
      expect(() => validateSocialHandleFormat('user', 'tiktok')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('user', 'tiktok')).toThrow('unsupported platform: tiktok');
    });

    it('throws RangeError for unsupported platform "linkedin"', () => {
      expect(() => validateSocialHandleFormat('user', 'linkedin')).toThrow(RangeError);
      expect(() => validateSocialHandleFormat('user', 'linkedin')).toThrow('unsupported platform: linkedin');
    });

    it('includes the normalized (lowercased) platform name in the error', () => {
      expect(() => validateSocialHandleFormat('user', 'Facebook')).toThrow('unsupported platform: facebook');
    });

    it('includes the normalized (trimmed, lowercased) platform name in the error', () => {
      expect(() => validateSocialHandleFormat('user', '  LinkedIn  ')).toThrow('unsupported platform: linkedin');
    });
  });

  // --- Return value: validated handle without '@' ---
  describe('return value', () => {
    it('returns handle without @ for twitter', () => {
      const result = validateSocialHandleFormat('@myhandle', 'twitter');
      expect(result).toBe('myhandle');
      expect(result.startsWith('@')).toBe(false);
    });

    it('returns handle without @ for instagram', () => {
      const result = validateSocialHandleFormat('@my_handle', 'instagram');
      expect(result).toBe('my_handle');
      expect(result.startsWith('@')).toBe(false);
    });

    it('returns handle without @ for github', () => {
      const result = validateSocialHandleFormat('@my-handle', 'github');
      expect(result).toBe('my-handle');
      expect(result.startsWith('@')).toBe(false);
    });

    it('returns trimmed handle for twitter without @', () => {
      const result = validateSocialHandleFormat('  user123  ', 'twitter');
      expect(result).toBe('user123');
    });
  });
});