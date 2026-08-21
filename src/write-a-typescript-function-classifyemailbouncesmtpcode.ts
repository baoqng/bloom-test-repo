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

  const hardEnhancedCodes = new Set(['5.1.1', '5.1.2', '5.2.1', '5.7.1']);
  const softEnhancedCodes = new Set(['4.2.1', '4.2.2', '4.4.1']);

  const enhancedReasons: Record<string, string> = {
    '5.1.1': 'Unknown user',
    '5.1.2': 'Bad destination mailbox address',
    '5.2.1': 'Mailbox disabled, not accepting messages',
    '5.7.1': 'Delivery not authorized, message refused',
    '4.2.1': 'Mailbox full',
    '4.2.2': 'Mailbox over quota',
    '4.4.1': 'Connection timed out',
  };

  if (typeof enhancedCode === 'string') {
    if (hardEnhancedCodes.has(enhancedCode)) {
      return {
        category: 'hard',
        retryable: false,
        reason: enhancedReasons[enhancedCode] ?? `Hard bounce (enhanced code ${enhancedCode})`,
      };
    }
    if (softEnhancedCodes.has(enhancedCode)) {
      return {
        category: 'soft',
        retryable: true,
        reason: enhancedReasons[enhancedCode] ?? `Soft bounce (enhanced code ${enhancedCode})`,
      };
    }
  }

  const firstDigit = smtpStr[0];

  if (firstDigit === '5') {
    return {
      category: 'hard',
      retryable: false,
      reason: `Hard bounce: permanent failure with SMTP code ${smtpStr}`,
    };
  }

  if (firstDigit === '4') {
    return {
      category: 'soft',
      retryable: true,
      reason: `Soft bounce: temporary failure with SMTP code ${smtpStr}`,
    };
  }

  return {
    category: 'unknown',
    retryable: false,
    reason: `Non-bounce SMTP code ${smtpStr}`,
  };
}

export { classifyEmailBounce };