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
    const feedback: string[] = [];
    feedback.push('Use at least 8 characters');
    if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
    if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
    if (!/[0-9]/.test(password)) feedback.push('Add digits');
    if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add symbols');
    return { score: 0, label: 'very-weak', feedback };
  }

  // Single repeated character check
  if (password.length > 0 && /^(.)\1*$/.test(password)) {
    const feedback: string[] = [];
    if (password.length < 8) feedback.push('Use at least 8 characters');
    if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
    if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
    if (!/[0-9]/.test(password)) feedback.push('Add digits');
    if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add symbols');
    return { score: 0, label: 'very-weak', feedback };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const allDigits = /^[0-9]+$/.test(password);
  const hasTripleRun = /(.)\1{2,}/.test(password);

  let points = 0;

  if (password.length >= 8) points += 1;
  if (password.length >= 12) points += 1;
  if (hasUppercase) points += 1;
  if (hasLowercase) points += 1;
  if (hasDigit) points += 1;
  if (hasSymbol) points += 1;
  if (allDigits) points -= 1;
  if (hasTripleRun) points -= 1;

  // Clamp to [0, 4]
  const score = Math.max(0, Math.min(4, points)) as 0 | 1 | 2 | 3 | 4;

  // Build feedback (only when score < 4)
  const feedback: string[] = [];
  if (score < 4) {
    if (password.length < 8) feedback.push('Use at least 8 characters');
    if (!hasUppercase) feedback.push('Add uppercase letters');
    if (!hasLowercase) feedback.push('Add lowercase letters');
    if (!hasDigit) feedback.push('Add digits');
    if (!hasSymbol) feedback.push('Add symbols');
  }

  return { score, label: labels[score], feedback };
}