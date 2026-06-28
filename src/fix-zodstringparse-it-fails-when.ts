// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

type ZodStringInput = {
  data: unknown;
};

type ParseContext = {
  addIssue: (issue: z.IssueData) => void;
};

const INVALID = z.NEVER;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

function parseZodString(
  input: ZodStringInput,
  ctx: ParseContext
): string | typeof INVALID {
  if (isUndefined(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
    });
    return INVALID;
  }

  if (!isString(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: z.getParsedType(input.data),
    });
    return INVALID;
  }

  return input.data;
}

class ZodStringParser {
  private schema: z.ZodString;

  constructor(schema?: z.ZodString) {
    this.schema = schema ?? z.string();
  }

  parse(input: ZodStringInput): { success: true; data: string } | { success: false; error: z.ZodError } {
    const issues: z.ZodIssue[] = [];

    const ctx: ParseContext = {
      addIssue: (issue: z.IssueData) => {
        const zodIssue: z.ZodIssue = {
          ...issue,
          path: [],
          message: issue.message ?? this.getDefaultMessage(issue),
        } as z.ZodIssue;
        issues.push(zodIssue);
      },
    };

    const result = parseZodString(input, ctx);

    if (issues.length > 0) {
      return { success: false, error: new z.ZodError(issues) };
    }

    if (result === INVALID) {
      return {
        success: false,
        error: new z.ZodError([
          {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ZodParsedType.undefined,
            path: [],
            message: "Required",
          },
        ]),
      };
    }

    return { success: true, data: result };
  }

  private getDefaultMessage(issue: z.IssueData): string {
    if (issue.code === ZodIssueCode.invalid_type) {
      return `Expected ${issue.expected}, received ${issue.received}`;
    }
    return "Invalid value";
  }
}

function fixedZodStringParse(
  input: ZodStringInput
): { success: true; data: string } | { success: false; error: z.ZodError } {
  const parser = new ZodStringParser();
  return parser.parse(input);
}

function createSafeZodString(): z.ZodString {
  return z.string();
}

function safeParse(
  schema: z.ZodString,
  value: unknown
): z.SafeParseReturnType<string, string> {
  if (isUndefined(value)) {
    const error = new z.ZodError([
      {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
        path: [],
        message: "Required",
      },
    ]);
    return { success: false, error };
  }

  return schema.safeParse(value);
}

export {
  parseZodString,
  ZodStringParser,
  fixedZodStringParse,
  createSafeZodString,
  safeParse,
  isString,
  isUndefined,
};

export type { ZodStringInput, ParseContext };