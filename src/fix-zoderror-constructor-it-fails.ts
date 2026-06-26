// bloom-deps: zod

import { ZodError, ZodIssue } from "zod";

export function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new ZodError(issues);
}

export function patchZodErrorConstructor(): void {
  const OriginalZodError = ZodError as unknown as {
    new (issues: ZodIssue[]): ZodError;
    prototype: ZodError;
  };

  const OriginalConstructor = OriginalZodError;

  function PatchedZodError(this: ZodError, issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    return new OriginalConstructor(issues);
  }

  PatchedZodError.prototype = OriginalZodError.prototype;

  (ZodError as unknown as Record<string, unknown>)["create"] =
    function (issues: ZodIssue[]): ZodError {
      if (issues.length === 0) {
        throw new TypeError(
          "ZodError requires at least one issue; got empty array"
        );
      }
      return new ZodError(issues);
    };
}

export class SafeZodError extends ZodError {
  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    super(issues);
  }
}

export function buildZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError(
      "ZodError requires at least one issue; got empty array"
    );
  }

  return new ZodError(issues);
}