// bloom-deps:

function scorePasswordStrength(password: unknown): {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  feedback: string[];
} {
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }

  const labels: ['very-weak', 'weak', 'fair', 'strong', 'very-strong'] = [
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

  // Single repeated character check
  if (password.length > 0 && /^(.)\1+$/.test(password)) {
    const feedback = buildFeedback(password);
    return { score: 0, label: 'very-weak', feedback };
  }

  // Accumulate points
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Deductions
  if (/^[0-9]+$/.test(password)) score -= 1;
  if (/(.)\1{2,}/.test(password)) score -= 1;

  // Clamp
  if (score < 0) score = 0;
  if (score > 4) score = 4;

  const clampedScore = score as 0 | 1 | 2 | 3 | 4;
  const label = labels[clampedScore];

  const feedback = clampedScore === 4 ? [] : buildFeedback(password);

  return { score: clampedScore, label, feedback };
}

function buildFeedback(password: string): string[] {
  const suggestions: string[] = [];

  if (password.length < 8) {
    suggestions.push('Use at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push('Add at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    suggestions.push('Add at least one digit');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push('Add at least one symbol');
  }

  return suggestions;
}

export { scorePasswordStrength };