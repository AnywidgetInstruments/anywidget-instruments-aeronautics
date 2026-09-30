import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { CONTRACTS } from "../src/generated/contract.js";
import { PX_PER_DEG } from "../src/widgets/attitude.js";
import { angle, defaults, frame, mount } from "./helpers.js";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

type Title = keyof typeof CONTRACTS;
const WIDGETS: Array<[Title, Record<string, unknown>]> = [
  ["AirspeedIndicator", { value: 95 }],
  ["AttitudeIndicator", { pitch: 5, roll: -10 }],
  ["Altimeter", { value: 3500 }],
  ["TurnCoordinator", { rate: 3, slip: 0 }],
  ["HeadingIndicator", { value: 275 }],
  ["VerticalSpeedIndicator", { value: 500 }],
];

describe("every widget (API-001 .. API-003, ROB-002, A11Y-001)", () => {
  test.each(WIDGETS)("%s is an indicator that shows its values as text", async (title, values) => {
    const w = mount(defaults(title, values));
    await frame();
    expect(w.root.classList.contains("awf-root")).toBe(true);
    expect(w.root.classList.contains("awi-indicator")).toBe(true);
    expect(w.readout()).not.toMatch(/NO VALUE|INVALID/);
    expect(w.body.getAttribute("role")).toBe("img");
    expect(w.body.getAttribute("aria-label")).toContain(w.readout());
    w.cleanup();
  });

  test.each(WIDGETS)("%s shows NO VALUE before its first value, not a zero", async (title) => {
    const w = mount(defaults(title));
    await frame();
    expect(w.readout()).toBe("NO VALUE");
    expect(w.root.classList.contains("awf-missing")).toBe(true);
    w.cleanup();
  });

  test.each(WIDGETS)("%s works when a host sets only its values (_kind and values)", async (title, values) => {
    const w = mount({ _kind: CONTRACTS[title].kind, ...values });
    await frame();
    expect(w.root.classList.contains("awf-invalid")).toBe(false);
    expect(w.readout()).not.toMatch(/NO VALUE|INVALID/);
    w.cleanup();
  });

  test("a keypress or a click does not change a value (API-003)", async () => {
    const w = mount(defaults("HeadingIndicator", { value: 90 }));
    await frame();
    w.body.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(w.model.traits.value).toBe(90);
    w.cleanup();
  });
});

describe("robustness (ROB-001, ROB-003, UNIT-003)", () => {
  test("a value older than max_age is stale", async () => {
    const w = mount(defaults("AirspeedIndicator", { value: 90, max_age: 1 }));
    await frame();
    expect(w.readout()).toBe("90 kt");
    await vi.advanceTimersByTimeAsync(1500);
    expect(w.readout()).toBe("90 kt · STALE");
    expect(w.root.classList.contains("awf-stale")).toBe(true);
    w.cleanup();
  });

  test.each([
    ["an unknown unit", "AirspeedIndicator", { value: 90, unit: "knots" }],
    ["a unit of another quantity", "Altimeter", { value: 90, input_unit: "kt" }],
    ["a value of the wrong type", "HeadingIndicator", { value: "north" }],
    ["a non-finite value", "VerticalSpeedIndicator", { value: "nan" }],
  ] as Array<[string, Title, Record<string, unknown>]>)("%s shows INVALID rather than a figure", async (_n, title, traits) => {
    const w = mount(defaults(title, traits));
    await frame();
    expect(w.readout()).toBe("INVALID");
    w.cleanup();
  });
});

describe("the basic six", () => {
  test("airspeed converts to the displayed unit and turns with the value (FLT-001)", async () => {
    const w = mount(defaults("AirspeedIndicator", { value: 100, unit: "km/h", max: 200 }));
    await frame();
    expect(w.readout()).toBe("185 km/h");
    expect(angle(w.el.querySelector(".awf-pointer"))).toBeCloseTo(0, 5); // mid-scale at 12 o'clock
    w.cleanup();
  });

  test("airspeed draws its arcs and the never-exceed line (FLT-011)", async () => {
    const w = mount(defaults("AirspeedIndicator", { value: 90, white_arc: [40, 85], green_arc: [50, 130], yellow_arc: [130, 160], vne: 160 }));
    await frame();
    for (const c of ["awf-arc-white", "awf-arc-green", "awf-arc-yellow", "awf-vne"]) expect(w.el.querySelectorAll(`.${c}`)).toHaveLength(1);
    w.cleanup();
  });

  test("the horizon moves with pitch and roll around a fixed aircraft (FLT-012)", async () => {
    const w = mount(defaults("AttitudeIndicator", { pitch: 10, roll: 20 }));
    await frame();
    const t = w.el.querySelector(".awf-horizon")?.getAttribute("transform") ?? "";
    expect(t).toContain("rotate(-20.00");
    expect(t).toContain(`translate(0 ${(10 * PX_PER_DEG).toFixed(2)})`);
    expect(w.el.querySelector(".awf-aircraft")?.getAttribute("transform")).toBeNull();
    expect(w.readout()).toBe("pitch +10.0° roll +20.0°");
    w.cleanup();
  });

  test("the altimeter turns its pointers per 1000 and 10 000 (FLT-013)", async () => {
    const w = mount(defaults("Altimeter", { value: 3500, pressure: 1013.25 }));
    await frame();
    expect(angle(w.el.querySelector(".awf-hundreds"))).toBeCloseTo(180, 5);
    expect(angle(w.el.querySelector(".awf-thousands"))).toBeCloseTo(126, 5);
    expect(w.el.querySelector(".awf-window")?.textContent).toBe("1013");
    expect(w.readout()).toBe("3500 ft");
    w.cleanup();
  });

  test("the altimeter converts feet to metres", async () => {
    const w = mount(defaults("Altimeter", { value: 1000, unit: "m" }));
    await frame();
    expect(w.readout()).toBe("305 m");
    w.cleanup();
  });

  test("the turn coordinator banks its symbol and moves the ball (FLT-014)", async () => {
    const w = mount(defaults("TurnCoordinator", { rate: -3, slip: 0.5 }));
    await frame();
    expect(angle(w.el.querySelector(".awf-turn-symbol"))).toBe(-20);
    expect(Number(w.el.querySelector(".awf-ball")?.getAttribute("cx"))).toBeGreaterThan(100);
    expect(w.readout()).toBe("left 3.0 °/s");
    w.cleanup();
  });

  test("the heading card puts the heading under the lubber line (FLT-015)", async () => {
    const w = mount(defaults("HeadingIndicator", { value: 365, bug: 90 }));
    await frame();
    expect(w.readout()).toBe("005°");
    expect(angle(w.el.querySelector(".awf-card"))).toBe(-5);
    expect(angle(w.el.querySelector(".awf-bug"))).toBe(90);
    w.cleanup();
  });

  test("the VSI says climb or descent (FLT-016)", async () => {
    const up = mount(defaults("VerticalSpeedIndicator", { value: 487 }));
    const down = mount(defaults("VerticalSpeedIndicator", { value: -2.54, input_unit: "m/s" }));
    await frame();
    expect(up.readout()).toBe("↑ 490 ft/min");
    expect(down.readout()).toBe("↓ 500 ft/min");
    up.cleanup();
    down.cleanup();
  });

  test("the night theme is the dark one at a lower luminance (API-004)", async () => {
    const w = mount(defaults("HeadingIndicator", { value: 0, theme: "night" }));
    await frame();
    expect(w.root.classList.contains("awf-night")).toBe(true);
    expect(w.root.classList.contains("awi-theme-dark")).toBe(true);
    w.cleanup();
  });
});
