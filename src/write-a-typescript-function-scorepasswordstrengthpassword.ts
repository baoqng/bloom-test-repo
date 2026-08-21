// bloom-deps:

export function scorePasswordStrength(password: unknown): {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  feedback: string[];
} {
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }

  const labels: Array<'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'> = [
    'very-weak',
    'weak',
    'fair',
    'strong',
    'very-strong',
  ];

  // Score 0 conditions
  if (password.length < 6) {
    const feedback = buildFeedback(password);
    return { score: 0, label: 'very-weak', feedback };
  }

  // Check if consists of a single repeated character
  if (password.length > 0 && /^(.)\1*$/.test(password)) {
    const feedback = buildFeedback(password);
    return { score: 0, label: 'very-weak', feedback };
  }

  let points = 0;

  const hasLengthGte8 = password.length >= 8;
  const hasLengthGte12 = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLengthGte8) points += 1;
  if (hasLengthGte12) points += 1;
  if (hasUppercase) points += 1;
  if (hasLowercase) points += 1;
  if (hasDigit) points += 1;
  if (hasSymbol) points += 1;

  // Penalties
  const allDigits = /^[0-9]+$/.test(password);
  if (allDigits) points -= 1;

  const hasRunOf3 = /(.)\1{2,}/.test(password);
  if (hasRunOf3) points -= 1;

  // Clamp to [0, 4]
  const clamped = Math.max(0, Math.min(4, points)) as 0 | 1 | 2 | 3 | 4;

  const feedback = clamped === 4 ? [] : buildFeedback(password);

  return {
    score: clamped,
    label: labels[clamped],
    feedback,
  };
}

function buildFeedback(password: string): string[] {
  const suggestions: string[] = [];

  if (password.length < 8) {
    suggestions.push('Use at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters');
  }

  if (!/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters');
  }

  if (!/[0-9]/.test(password)) {
    suggestions.push('Add digits');
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push('Add symbols');
  }

  return suggestions;
}