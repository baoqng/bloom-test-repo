// bloom-deps:

function scorePasswordStrength(password: unknown): {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  feedback: string[];
} {
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }

  // Score 0 rules
  const isScoreZero =
    password.length < 6 ||
    (password.length > 0 && new Set(password.split('')).size === 1);

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
  if (/(.)\1{2,}/.test(password)) score--;

  // If score 0 rule triggered, force score to 0
  if (isScoreZero) {
    score = 0;
  } else {
    // Clamp to [0, 4]
    if (score < 0) score = 0;
    if (score > 4) score = 4;
  }

  const clampedScore = score as 0 | 1 | 2 | 3 | 4;

  const labels: Record<0 | 1 | 2 | 3 | 4, 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'> = {
    0: 'very-weak',
    1: 'weak',
    2: 'fair',
    3: 'strong',
    4: 'very-strong',
  };

  // Feedback is evaluated independently of Score 0 rules and score clamping
  const feedback: string[] = [];

  if (password.length < 8) feedback.push('Use at least 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('Add an uppercase letter');
  if (!/[a-z]/.test(password)) feedback.push('Add a lowercase letter');
  if (!/[0-9]/.test(password)) feedback.push('Add a number');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add a special character');

  return {
    score: clampedScore,
    label: labels[clampedScore],
    feedback,
  };
}

export { scorePasswordStrength };