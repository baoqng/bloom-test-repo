// bloom-deps:

function validateWeekday(day: unknown): { name: string; index: number; isWeekend: boolean } {
  if (typeof day !== "string") {
    throw new TypeError("day must be a string");
  }

  if (!day.trim()) {
    throw new RangeError("day must not be empty");
  }

  const normalized = day.trim().toLowerCase();

  const weekdays: Array<{ full: string; abbr: string; index: number; isWeekend: boolean }> = [
    { full: "monday",    abbr: "mon", index: 0, isWeekend: false },
    { full: "tuesday",   abbr: "tue", index: 1, isWeekend: false },
    { full: "wednesday", abbr: "wed", index: 2, isWeekend: false },
    { full: "thursday",  abbr: "thu", index: 3, isWeekend: false },
    { full: "friday",    abbr: "fri", index: 4, isWeekend: false },
    { full: "saturday",  abbr: "sat", index: 5, isWeekend: true  },
    { full: "sunday",    abbr: "sun", index: 6, isWeekend: true  },
  ];

  const match = weekdays.find(w => w.full === normalized || w.abbr === normalized);

  if (!match) {
    throw new RangeError(`unknown weekday: ${normalized}`);
  }

  return {
    name: match.full,
    index: match.index,
    isWeekend: match.isWeekend,
  };
}

export { validateWeekday };