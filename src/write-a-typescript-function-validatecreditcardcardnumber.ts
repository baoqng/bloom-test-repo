// bloom-deps:

function luhn(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function detectBrand(digits: string): string {
  // Amex: starts with 34 or 37
  if (/^3[47]/.test(digits)) return 'Amex';

  // Visa: starts with 4
  if (/^4/.test(digits)) return 'Visa';

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  const prefix4 = parseInt(digits.slice(0, 4), 10);
  if (prefix4 >= 2221 && prefix4 <= 2720) return 'Mastercard';

  // Discover: starts with 6011 or 65
  if (/^6011/.test(digits) || /^65/.test(digits)) return 'Discover';

  return 'unknown';
}

export function validateCreditCard(cardNumber: string): { valid: boolean; brand: string } {
  if (typeof cardNumber !== 'string') {
    throw new TypeError('cardNumber must be a string');
  }

  const digits = cardNumber.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(digits) || digits.length === 0) {
    return { valid: false, brand: 'unknown' };
  }

  const passesLuhn = luhn(digits);
  if (!passesLuhn) {
    return { valid: false, brand: 'unknown' };
  }

  const brand = detectBrand(digits);
  if (brand === 'unknown') {
    return { valid: false, brand: 'unknown' };
  }

  return { valid: true, brand };
}