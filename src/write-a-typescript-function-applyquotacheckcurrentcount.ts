// bloom-deps:
import { describe, it, expect } from "vitest";

function applyQuotaCheck(
  currentCount: unknown,
  limit: unknown,
  windowUsedMs: unknown,
  windowMs: unknown
): { allowed: boolean; remaining: number; resetAfterMs: number } {
  if (
    typeof currentCount !== "number" ||
    !Number.isFinite(currentCount) ||
    !Number.isInteger(currentCount) ||
    currentCount < 0
  ) {
    throw new TypeError("currentCount must be a non-negative integer");
  }

  if (
    typeof limit !== "number" ||
    !Number.isFinite(limit) ||
    !Number.isInteger(limit) ||
    limit <= 0
  ) {
    throw new TypeError("limit must be a positive integer");
  }

  if (
    typeof windowUsedMs !== "number" ||
    !Number.isFinite(windowUsedMs) ||
    !Number.isInteger(windowUsedMs) ||
    windowUsedMs < 0
  ) {
    throw new TypeError("windowUsedMs must be a non-negative integer");
  }

  if (
    typeof windowMs !== "number" ||
    !Number.isFinite(windowMs) ||
    !Number.isInteger(windowMs) ||
    windowMs <= 0
  ) {
    throw new TypeError("windowMs must be a positive integer");
  }

  if (windowUsedMs > windowMs) {
    throw new RangeError("windowUsedMs must not exceed windowMs");
  }

  const allowed = currentCount < limit;
  const remaining = allowed ? Math.max(0, limit - currentCount) : 0;
  const resetAfterMs = windowMs - windowUsedMs;

  return { allowed, remaining, resetAfterMs };
}

describe("applyQuotaCheck", () => {
  // --- currentCount validation ---
  describe("invalid currentCount", () => {
    it("throws TypeError when currentCount is a string", () => {
      expect(() => applyQuotaCheck("0", 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck("0", 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is null", () => {
      expect(() => applyQuotaCheck(null, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(null, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is undefined", () => {
      expect(() => applyQuotaCheck(undefined, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(undefined, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is NaN", () => {
      expect(() => applyQuotaCheck(NaN, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(NaN, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is Infinity", () => {
      expect(() => applyQuotaCheck(Infinity, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(Infinity, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is -Infinity", () => {
      expect(() => applyQuotaCheck(-Infinity, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(-Infinity, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is a float", () => {
      expect(() => applyQuotaCheck(1.5, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(1.5, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is negative", () => {
      expect(() => applyQuotaCheck(-1, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(-1, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });

    it("throws TypeError when currentCount is a boolean", () => {
      expect(() => applyQuotaCheck(true, 10, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(true, 10, 0, 1000)).toThrow(
        "currentCount must be a non-negative integer"
      );
    });
  });

  // --- limit validation ---
  describe("invalid limit", () => {
    it("throws TypeError when limit is a string", () => {
      expect(() => applyQuotaCheck(0, "10", 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, "10", 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });

    it("throws TypeError when limit is null", () => {
      expect(() => applyQuotaCheck(0, null, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, null, 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });

    it("throws TypeError when limit is NaN", () => {
      expect(() => applyQuotaCheck(0, NaN, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, NaN, 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });

    it("throws TypeError when limit is Infinity", () => {
      expect(() => applyQuotaCheck(0, Infinity, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, Infinity, 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });

    it("throws TypeError when limit is a float", () => {
      expect(() => applyQuotaCheck(0, 1.5, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 1.5, 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });

    it("throws TypeError when limit is zero", () => {
      expect(() => applyQuotaCheck(0, 0, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 0, 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });

    it("throws TypeError when limit is negative", () => {
      expect(() => applyQuotaCheck(0, -5, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, -5, 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });

    it("throws TypeError when limit is undefined", () => {
      expect(() => applyQuotaCheck(0, undefined, 0, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, undefined, 0, 1000)).toThrow(
        "limit must be a positive integer"
      );
    });
  });

  // --- windowUsedMs validation ---
  describe("invalid windowUsedMs", () => {
    it("throws TypeError when windowUsedMs is a string", () => {
      expect(() => applyQuotaCheck(0, 10, "0", 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, "0", 1000)).toThrow(
        "windowUsedMs must be a non-negative integer"
      );
    });

    it("throws TypeError when windowUsedMs is null", () => {
      expect(() => applyQuotaCheck(0, 10, null, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, null, 1000)).toThrow(
        "windowUsedMs must be a non-negative integer"
      );
    });

    it("throws TypeError when windowUsedMs is NaN", () => {
      expect(() => applyQuotaCheck(0, 10, NaN, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, NaN, 1000)).toThrow(
        "windowUsedMs must be a non-negative integer"
      );
    });

    it("throws TypeError when windowUsedMs is Infinity", () => {
      expect(() => applyQuotaCheck(0, 10, Infinity, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, Infinity, 1000)).toThrow(
        "windowUsedMs must be a non-negative integer"
      );
    });

    it("throws TypeError when windowUsedMs is a float", () => {
      expect(() => applyQuotaCheck(0, 10, 0.5, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0.5, 1000)).toThrow(
        "windowUsedMs must be a non-negative integer"
      );
    });

    it("throws TypeError when windowUsedMs is negative", () => {
      expect(() => applyQuotaCheck(0, 10, -1, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, -1, 1000)).toThrow(
        "windowUsedMs must be a non-negative integer"
      );
    });

    it("throws TypeError when windowUsedMs is undefined", () => {
      expect(() => applyQuotaCheck(0, 10, undefined, 1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, undefined, 1000)).toThrow(
        "windowUsedMs must be a non-negative integer"
      );
    });
  });

  // --- windowMs validation ---
  describe("invalid windowMs", () => {
    it("throws TypeError when windowMs is a string", () => {
      expect(() => applyQuotaCheck(0, 10, 0, "1000")).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, "1000")).toThrow(
        "windowMs must be a positive integer"
      );
    });

    it("throws TypeError when windowMs is null", () => {
      expect(() => applyQuotaCheck(0, 10, 0, null)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, null)).toThrow(
        "windowMs must be a positive integer"
      );
    });

    it("throws TypeError when windowMs is NaN", () => {
      expect(() => applyQuotaCheck(0, 10, 0, NaN)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, NaN)).toThrow(
        "windowMs must be a positive integer"
      );
    });

    it("throws TypeError when windowMs is Infinity", () => {
      expect(() => applyQuotaCheck(0, 10, 0, Infinity)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, Infinity)).toThrow(
        "windowMs must be a positive integer"
      );
    });

    it("throws TypeError when windowMs is a float", () => {
      expect(() => applyQuotaCheck(0, 10, 0, 1000.5)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, 1000.5)).toThrow(
        "windowMs must be a positive integer"
      );
    });

    it("throws TypeError when windowMs is zero", () => {
      expect(() => applyQuotaCheck(0, 10, 0, 0)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, 0)).toThrow(
        "windowMs must be a positive integer"
      );
    });

    it("throws TypeError when windowMs is negative", () => {
      expect(() => applyQuotaCheck(0, 10, 0, -1000)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, -1000)).toThrow(
        "windowMs must be a positive integer"
      );
    });

    it("throws TypeError when windowMs is undefined", () => {
      expect(() => applyQuotaCheck(0, 10, 0, undefined)).toThrow(TypeError);
      expect(() => applyQuotaCheck(0, 10, 0, undefined)).toThrow(
        "windowMs must be a positive integer"
      );
    });
  });

  // --- windowUsedMs exceeds windowMs ---
  describe("window used exceeds window", () => {
    it("throws RangeError when windowUsedMs > windowMs", () => {
      expect(() => applyQuotaCheck(0, 10, 1001, 1000)).toThrow(RangeError);
      expect(() => applyQuotaCheck(0, 10, 1001, 1000)).toThrow(
        "windowUsedMs must not exceed windowMs"
      );
    });

    it("throws RangeError when windowUsedMs is much greater than windowMs", () => {
      expect(() => applyQuotaCheck(0, 10, 5000, 1000)).toThrow(RangeError);
      expect(() => applyQuotaCheck(0, 10, 5000, 1000)).toThrow(
        "windowUsedMs must not exceed windowMs"
      );
    });

    it("does NOT throw when windowUsedMs equals windowMs", () => {
      expect(() => applyQuotaCheck(0, 10, 1000, 1000)).not.toThrow();
    });
  });

  // --- within quota (allowed = true) ---
  describe("within quota", () => {
    it("returns allowed=true when currentCount < limit", () => {
      const result = applyQuotaCheck(5, 10, 200, 1000);
      expect(result.allowed).toBe(true);
    });

    it("returns correct remaining when currentCount < limit", () => {
      const result = applyQuotaCheck(5, 10, 200, 1000);
      expect(result.remaining).toBe(5);
    });

    it("returns correct resetAfterMs when currentCount < limit", () => {
      const result = applyQuotaCheck(5, 10, 200, 1000);
      expect(result.resetAfterMs).toBe(800);
    });

    it("returns allowed=true when currentCount is 0", () => {
      const result = applyQuotaCheck(0, 10, 0, 1000);
      expect(result.allowed).toBe(true);
    });

    it("returns remaining=10 when currentCount is 0 and limit is 10", () => {
      const result = applyQuotaCheck(0, 10, 0, 1000);
      expect(result.remaining).toBe(10);
    });

    it("returns resetAfterMs=1000 when windowUsedMs is 0 and windowMs is 1000", () => {
      const result = applyQuotaCheck(0, 10, 0, 1000);
      expect(result.resetAfterMs).toBe(1000);
    });

    it("returns allowed=true when currentCount is limit - 1", () => {
      const result = applyQuotaCheck(9, 10, 500, 1000);
      expect(result.allowed).toBe(true);
    });

    it("returns remaining=1 when currentCount is limit - 1", () => {
      const result = applyQuotaCheck(9, 10, 500, 1000);
      expect(result.remaining).toBe(1);
    });

    it("returns correct resetAfterMs when windowUsedMs equals windowMs", () => {
      const result = applyQuotaCheck(0, 10, 1000, 1000);
      expect(result.resetAfterMs).toBe(0);
    });

    it("returns all three fields", () => {
      const result = applyQuotaCheck(3, 10, 100, 1000);
      expect(result).toHaveProperty("allowed");
      expect(result).toHaveProperty("remaining");
      expect(result).toHaveProperty("resetAfterMs");
    });
  });

  // --- quota exceeded (allowed = false) ---
  describe("quota exceeded", () => {
    it("returns allowed=false when currentCount equals limit", () => {
      const result = applyQuotaCheck(10, 10, 200, 1000);
      expect(result.allowed).toBe(false);
    });

    it("returns remaining=0 when currentCount equals limit", () => {
      const result = applyQuotaCheck(10, 10, 200, 1000);
      expect(result.remaining).toBe(0);
    });

    it("returns correct resetAfterMs when currentCount equals limit", () => {
      const result = applyQuotaCheck(10, 10, 200, 1000);
      expect(result.resetAfterMs).toBe(800);
    });

    it("returns allowed=false when currentCount exceeds limit", () => {
      const result = applyQuotaCheck(15, 10, 200, 1000);
      expect(result.allowed).toBe(false);
    });

    it("returns remaining=0 when currentCount exceeds limit", () => {
      const result = applyQuotaCheck(15, 10, 200, 1000);
      expect(result.remaining).toBe(0);
    });

    it("returns correct resetAfterMs when currentCount exceeds limit", () => {
      const result = applyQuotaCheck(15, 10, 200, 1000);
      expect(result.resetAfterMs).toBe(800);
    });

    it("returns all three fields when quota exceeded", () => {
      const result = applyQuotaCheck(10, 10, 0, 1000);
      expect(result).toHaveProperty("allowed");
      expect(result).toHaveProperty("remaining");
      expect(result).toHaveProperty("resetAfterMs");
    });
  });

  // --- edge cases for remaining using Math.max(0, ...) ---
  describe("remaining floor at 0", () => {
    it("remaining is never negative when currentCount far exceeds limit", () => {
      const result = applyQuotaCheck(100, 10, 0, 1000);
      expect(result.remaining).toBe(0);
    });
  });

  // --- resetAfterMs boundary ---
  describe("resetAfterMs calculation", () => {
    it("resetAfterMs is 0 when windowUsedMs equals windowMs", () => {
      const result = applyQuotaCheck(0, 10, 500, 500);
      expect(result.resetAfterMs).toBe(0);
    });

    it("resetAfterMs is windowMs when windowUsedMs is 0", () => {
      const result = applyQuotaCheck(0, 10, 0, 2000);
      expect(result.resetAfterMs).toBe(2000);
    });

    it("resetAfterMs is correct for arbitrary mid-window values", () => {
      const result = applyQuotaCheck(0, 10, 300, 1000);
      expect(result.resetAfterMs).toBe(700);
    });
  });

  // --- limit = 1 boundary ---
  describe("limit of 1", () => {
    it("allows when currentCount is 0 and limit is 1", () => {
      const result = applyQuotaCheck(0, 1, 0, 1000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(1);
    });

    it("denies when currentCount is 1 and limit is 1", () => {
      const result = applyQuotaCheck(1, 1, 0, 1000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });
});