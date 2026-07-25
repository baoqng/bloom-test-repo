// bloom-deps:

import fs from "fs";
import path from "path";

export function roundHalfEvenV21(x: number): number {
  if (typeof x !== "number" || !isFinite(x)) {
    throw new RangeError("x must be finite");
  }

  const floor = Math.floor(x);
  const fract = x - floor;

  if (fract === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  return Math.round(x);
}

export function ensureFileExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
}

export function getConfig(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export function parseNumberParam(param: string | undefined): number | null {
  if (param === undefined || param === null) {
    return null;
  }
  const parsed = Number(param);
  if (isNaN(parsed)) {
    return null;
  }
  return parsed;
}

export function validateEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatPrice(
  price: number | null | undefined,
  defaultValue: number = 0
): string {
  if (price === null || price === undefined) {
    return `$${defaultValue.toFixed(2)}`;
  }
  return `$${price.toFixed(2)}`;
}

export function filterByPriceRange(
  prices: number[],
  minPrice: number,
  maxPrice: number
): number[] {
  return prices.filter((price) => price >= minPrice && price <= maxPrice);
}

export function filterByQuantity(
  quantities: number[],
  minQuantity: number,
  maxQuantity: number
): number[] {
  return quantities.filter(
    (qty) => qty >= minQuantity && qty <= maxQuantity
  );
}

export function paginationOffset(page: number, limit: number): number {
  if (page < 1) {
    return 0;
  }
  return (page - 1) * limit;
}

export function filterByDateRange(
  dates: Date[],
  startDate: Date,
  endDate: Date
): Date[] {
  return dates.filter(
    (date) => date >= startDate && date <= endDate
  );
}

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = "ServiceError";
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new ServiceError("Max retries exceeded", {
    cause: lastError ?? undefined,
  });
}

export function isValidUserId(userId: string | null | undefined): boolean {
  return userId != null && userId.length > 0;
}

export function safePropertyAccess<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): T[K] | undefined {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  return obj[key];
}