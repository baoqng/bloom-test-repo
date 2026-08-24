// bloom-deps:

function validateISBN(isbn: string): { valid: boolean; type: 'ISBN-10' | 'ISBN-13' | 'unknown' } {
  if (typeof isbn !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const stripped = isbn.replace(/[-\s]/g, '');

  if (stripped.length === 10) {
    // ISBN-10 validation
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const char = stripped[i];
      let value: number;
      if (i === 9 && char === 'X') {
        value = 10;
      } else if (/\d/.test(char)) {
        value = parseInt(char, 10);
      } else {
        return { valid: false, type: 'ISBN-10' };
      }
      sum += value * (i + 1);
    }
    return { valid: sum % 11 === 0, type: 'ISBN-10' };
  } else if (stripped.length === 13) {
    // ISBN-13 validation
    for (const char of stripped) {
      if (!/\d/.test(char)) {
        return { valid: false, type: 'ISBN-13' };
      }
    }
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(stripped[i], 10);
      const weight = i % 2 === 0 ? 1 : 3;
      sum += digit * weight;
    }
    return { valid: sum % 10 === 0, type: 'ISBN-13' };
  } else {
    return { valid: false, type: 'unknown' };
  }
}

export { validateISBN };