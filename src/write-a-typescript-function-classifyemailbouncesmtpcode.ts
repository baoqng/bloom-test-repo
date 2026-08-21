// bloom-deps:

function classifyEmailBounce(
  smtpCode: unknown,
  enhancedCode?: unknown
): { category: 'hard' | 'soft' | 'unknown'; retryable: boolean; reason: string } {
  if (typeof smtpCode !== 'string' && typeof smtpCode !== 'number') {
    throw new TypeError('smtpCode must be a string or number');
  }

  const smtpStr = String(smtpCode).trim();

  if (!/^[2-5]\d{2}$/.test(smtpStr)) {
    throw new RangeError('smtpCode must be a 3-digit SMTP reply code');
  }

  if (enhancedCode !== undefined) {
    if (typeof enhancedCode !== 'string') {
      throw new TypeError('enhancedCode must be a string');
    }
    if (!/^\d+\.\d+\.\d+$/.test(enhancedCode)) {
      throw new RangeError('enhancedCode must be in N.N.N format');
    }
  }

  const hardEnhancedCodes: Record<string, string> = {
    '5.1.1': 'Unknown user',
    '5.1.2': 'Bad domain',
    '5.2.1': 'Mailbox disabled',
    '5.7.1': 'Delivery not authorized',
  };

  const softEnhancedCodes: Record<string, string> = {
    '4.2.1': 'Mailbox full',
    '4.2.2': 'Over quota',
    '4.4.1': 'Connection timed out',
  };

  if (enhancedCode !== undefined && typeof enhancedCode === 'string') {
    if (hardEnhancedCodes[enhancedCode] !== undefined) {
      return {
        category: 'hard',
        retryable: false,
        reason: `Hard bounce: ${hardEnhancedCodes[enhancedCode]} (enhanced code ${enhancedCode})`,
      };
    }
    if (softEnhancedCodes[enhancedCode] !== undefined) {
      return {
        category: 'soft',
        retryable: true,
        reason: `Soft bounce: ${softEnhancedCodes[enhancedCode]} (enhanced code ${enhancedCode})`,
      };
    }
  }

  const firstDigit = smtpStr[0];

  if (firstDigit === '5') {
    return {
      category: 'hard',
      retryable: false,
      reason: `Hard bounce: permanent failure (SMTP code ${smtpStr})`,
    };
  }

  if (firstDigit === '4') {
    return {
      category: 'soft',
      retryable: true,
      reason: `Soft bounce: temporary failure (SMTP code ${smtpStr})`,
    };
  }

  return {
    category: 'unknown',
    retryable: false,
    reason: `Unknown bounce category (SMTP code ${smtpStr})`,
  };
}

export { classifyEmailBounce };