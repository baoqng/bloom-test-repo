// bloom-deps:

export function scorePasswordStrength(password: unknown): {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  feedback: string[];
} {
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }

  // Compute feedback independently before any score logic
  const feedback: string[] = [];
  if (password.length < 8) feedback.push('Use at least 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('Add an uppercase letter');
  if (!/[a-z]/.test(password)) feedback.push('Add a lowercase letter');
  if (!/[0-9]/.test(password)) feedback.push('Add a number');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add a special character');

  // Score 0 rules
  const isSingleRepeated = password.length > 0 && /^(.)\1*$/.test(password);
  if (password.length < 6 || isSingleRepeated) {
    return { score: 0, label: 'very-weak', feedback };
  }

  // Accumulate points
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Deductions
  if (/^[0-9]+$/.test(password)) score--;
  if (/(.)\1\1/.test(password)) score--;

  // Clamp to [0, 4]
  if (score < 0) score = 0;
  if (score > 4) score = 4;

  const clampedScore = score as 0 | 1 | 2 | 3 | 4;

  const labels: Record<0 | 1 | 2 | 3 | 4, 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'> = {
    0: 'very-weak',
    1: 'weak',
    2: 'fair',
    3: 'strong',
    4: 'very-strong',
  };

  // If final clamped score is 4, return empty feedback
  const finalFeedback = clampedScore === 4 ? [] : feedback;

  return {
    score: clampedScore,
    label: labels[clampedScore],
    feedback: finalFeedback,
  };
}