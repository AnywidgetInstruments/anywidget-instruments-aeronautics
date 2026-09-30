import { describe, expect, test } from "vitest";
import { convert, format, isUnit } from "../src/core/units.js";
import { vsiAngle } from "../src/widgets/vsi.js";
import { symbolBank } from "../src/widgets/turn.js";

describe("units (UNIT-001, UNIT-002)", () => {
  test("converts with exact factors", () => {
    expect(convert("speed", 100, "kt", "km/h")).toBeCloseTo(185.2, 10);
    expect(convert("speed", 100, "mph", "kt")).toBeCloseTo(86.8976, 4);
    expect(convert("altitude", 1000, "ft", "m")).toBeCloseTo(304.8, 10);
    expect(convert("vertical", 500, "ft/min", "m/s")).toBeCloseTo(2.54, 10);
    expect(convert("pressure", 29.92, "inHg", "hPa")).toBeCloseTo(1013.2, 1);
  });

  test("knows the units of each quantity", () => {
    expect(isUnit("speed", "kt")).toBe(true);
    expect(isUnit("speed", "ft")).toBe(false);
    expect(isUnit("vertical", "knots")).toBe(false);
  });

  test("rounds for display", () => {
    expect(format("vertical", 487, "ft/min")).toBe("490");
    expect(format("vertical", 2.54, "m/s")).toBe("2.5");
    expect(format("pressure", 29.921, "inHg")).toBe("29.92");
    expect(format("pressure", 1013.25, "hPa")).toBe("1013");
  });
});

describe("scales", () => {
  test("the VSI gives the first half of the range 60% of the arc (FLT-016)", () => {
    expect(vsiAngle(0, 2000)).toBe(-90);
    expect(vsiAngle(1000, 2000)).toBeCloseTo(-90 + 0.6 * 170, 10);
    expect(vsiAngle(-1000, 2000)).toBeCloseTo(-90 - 0.6 * 170, 10);
    expect(vsiAngle(2000, 2000)).toBeCloseTo(80, 10);
    expect(vsiAngle(9000, 2000)).toBeCloseTo(80, 10);
  });

  test("the turn coordinator banks 20° at the standard rate, up to 1.5 times it (FLT-014)", () => {
    expect(symbolBank(3)).toBe(20);
    expect(symbolBank(-3)).toBe(-20);
    expect(symbolBank(10)).toBe(30);
  });
});
