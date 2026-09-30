// What a widget can say about its values (ROB-001 .. ROB-003), in order of
// precedence: a trait the schema rejects makes every figure doubtful, so it
// wins over everything else.

export type ValueState = "ok" | "invalid" | "missing" | "stale";

export interface StateInputs {
  /** Names of the traits whose raw value the schema rejects. */
  invalid: readonly string[];
  /** The values the widget shows, null when not received. */
  values: readonly unknown[];
  /** Seconds after which a value not updated is stale; 0: never. */
  maxAge: number;
  /** Time of the last update (ms), or null before the first one. */
  updated: number | null;
  now: number;
}

export function valueState({ invalid, values, maxAge, updated, now }: StateInputs): ValueState {
  if (invalid.length) return "invalid";
  if (values.some((v) => v === null || v === undefined)) return "missing";
  // a NaN or an infinity says the value is unknown: invalid, not a figure
  if (values.some((v) => typeof v === "number" && !Number.isFinite(v))) return "invalid";
  if (maxAge > 0 && updated !== null && now - updated > maxAge * 1000) return "stale";
  return "ok";
}

/** Text shown in place of a figure, and read by assistive technologies. */
export const STATE_TEXT: Record<Exclude<ValueState, "ok">, string> = {
  invalid: "INVALID",
  missing: "NO VALUE",
  stale: "STALE",
};
