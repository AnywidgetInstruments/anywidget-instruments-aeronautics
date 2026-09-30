// VerticalSpeedIndicator (FLT-006, FLT-016): zero at 9 o'clock, climbs above
// and descents below over 170° each way, the first half of the range over 60%
// of that arc, so that small rates stay readable.
import { clear, setText, svg, svgText } from "anywidget-instruments/js/src/core/dom.js";
import type { AnyModel } from "anywidget-instruments/js/src/core/model.js";
import { convert, format } from "../core/units.js";
import { AeronauticsView } from "../core/view.js";
import type { VerticalSpeedIndicatorTraits } from "../generated/contract.js";
import { CX, CY, face, label, niceStep, pointer, rotate, tick } from "./dial.js";

const ZERO = -90;
const SWEEP = 170;

/** Angle of a vertical speed on a scale of ±max (FLT-016). */
export function vsiAngle(v: number, max: number): number {
  const f = Math.min(Math.abs(v) / max, 1);
  const g = f <= 0.5 ? 1.2 * f : 0.6 + 0.8 * (f - 0.5);
  return ZERO + Math.sign(v) * g * SWEEP;
}

export class VerticalSpeedView extends AeronauticsView<VerticalSpeedIndicatorTraits> {
  readonly valueTraits = ["value"];
  override readonly unitTraits = { unit: "vertical", input_unit: "vertical" } as const;
  readonly scaleLayer = svg("g", { class: "awf-scale" });
  readonly needle = pointer(80, 4);
  readonly unitText = svgText("", { class: "awf-unit", x: CX + 22, y: CY + 30, "text-anchor": "middle" });

  constructor(model: AnyModel<VerticalSpeedIndicatorTraits>, el: HTMLElement) {
    super(model, el, ["value", "unit", "input_unit", "max"]);
    this.svgEl.append(face(), this.scaleLayer, this.unitText, this.needle, this.readout);
    this.watchValues();
  }

  private toUnit(v: number): number {
    return convert("vertical", v, String(this.get("input_unit")), String(this.get("unit")));
  }

  describe(): string {
    const v = this.toUnit(this.get("value") as number);
    const text = format("vertical", Math.abs(v), String(this.get("unit")));
    return `${Number(text) === 0 ? "" : v > 0 ? "↑ " : "↓ "}${text} ${String(this.get("unit"))}`;
  }

  override draw(): void {
    clear(this.scaleLayer);
    const max = this.get("max") as number;
    const dmax = this.toUnit(max);
    const step = niceStep(dmax, 4);
    for (let d = 0; d <= dmax + 1e-9; d += step / 2) {
      const major = Math.abs(d / step - Math.round(d / step)) < 1e-9;
      for (const s of d === 0 ? [0] : [-1, 1]) {
        const a = vsiAngle((s * d * max) / dmax, max);
        this.scaleLayer.append(tick(a, major ? 76 : 83, 90, major ? "awf-tick awf-major" : "awf-tick"));
        // the two ends of the scale meet at 3 o'clock: one label for both
        if (major && !(s < 0 && d >= dmax - 1e-9)) this.scaleLayer.append(label(String(+(d / (dmax >= 100 ? 100 : 1)).toFixed(1)), a, 64));
      }
    }
    this.scaleLayer.append(svgText("UP", { class: "awf-note", x: CX - 40, y: CY - 26, "text-anchor": "middle" }), svgText("DN", { class: "awf-note", x: CX - 40, y: CY + 32, "text-anchor": "middle" }));
    setText(this.unitText, dmax >= 100 ? `×100 ${String(this.get("unit"))}` : String(this.get("unit")));
    this.needle.style.visibility = this.shows() ? "" : "hidden";
    if (this.shows()) rotate(this.needle, vsiAngle(this.get("value") as number, max));
  }
}
