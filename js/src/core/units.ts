// Units of aviation (UNIT-001 .. UNIT-003), converted in the front end with
// exact factors so that every host shows the same figures (GEN-003).

/** Factor of each unit to the SI unit of its quantity (UNIT-002). */
export const UNITS = {
  speed: { kt: 1852 / 3600, "km/h": 1 / 3.6, mph: 1609.344 / 3600 },
  altitude: { ft: 0.3048, m: 1 },
  vertical: { "ft/min": 0.00508, "m/s": 1 },
  pressure: { hPa: 100, inHg: 3386.389 },
} as const;

export type Quantity = keyof typeof UNITS;

/** True when `unit` is a unit of `quantity`. */
export function isUnit(quantity: Quantity, unit: unknown): unit is string {
  return typeof unit === "string" && unit in UNITS[quantity];
}

/** `value` given in `from`, expressed in `to` (units of the same quantity). */
export function convert(quantity: Quantity, value: number, from: string, to: string): number {
  if (from === to) return value;
  const f = UNITS[quantity] as Record<string, number>;
  return (value * f[from]) / f[to];
}

/** Decimals shown for a quantity in a unit. */
export function decimalsOf(quantity: Quantity, unit: string): number {
  if (quantity === "pressure") return unit === "inHg" ? 2 : 0;
  if (quantity === "vertical") return unit === "m/s" ? 1 : 0;
  return 0;
}

/** `value` rounded for display in `unit`. */
export function format(quantity: Quantity, value: number, unit: string): string {
  const d = decimalsOf(quantity, unit);
  const step = quantity === "vertical" && unit === "ft/min" ? 10 : 10 ** -d;
  return (Math.round(value / step) * step + 0).toFixed(d);
}
