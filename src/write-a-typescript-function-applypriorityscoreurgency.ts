// bloom-deps:

function applyPriorityScore(urgency: unknown, impact: unknown, effort: unknown): { score: number; priority: 'critical' | 'high' | 'medium' | 'low' } {
  if (typeof urgency !== 'number' || isNaN(urgency)) {
    throw new TypeError('urgency must be a number');
  }
  if (!isFinite(urgency) || urgency < 1 || urgency > 10) {
    throw new RangeError('urgency must be between 1 and 10');
  }

  if (typeof impact !== 'number' || isNaN(impact)) {
    throw new TypeError('impact must be a number');
  }
  if (!isFinite(impact) || impact < 1 || impact > 10) {
    throw new RangeError('impact must be between 1 and 10');
  }

  if (typeof effort !== 'number' || isNaN(effort)) {
    throw new TypeError('effort must be a number');
  }
  if (!isFinite(effort) || effort < 1 || effort > 10) {
    throw new RangeError('effort must be between 1 and 10');
  }

  const score = Math.round(((urgency * 0.4) + (impact * 0.4) + ((11 - effort) * 0.2)) * 10) / 10;

  let priority: 'critical' | 'high' | 'medium' | 'low';
  if (score >= 8) {
    priority = 'critical';
  } else if (score >= 6) {
    priority = 'high';
  } else if (score >= 4) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  return { score, priority };
}

export { applyPriorityScore };