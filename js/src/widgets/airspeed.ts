// AirspeedIndicator (FLT-001, FLT-011): indicated airspeed on a dial of 300°,
// with the white, green and yellow arcs and the never-exceed line.
import { clear, svg } from "anywidget-instruments/js/src/core/dom.js";
import type { AnyModel, Traits } from "anywidget-instruments/js/src/core/model.js";
import { clamp, sectorPath } from "anywidget-instruments/js/src/core/scale.js";
import { convert, format } from "../core/units.js";
import { AeronauticsView } from "../core/view.js";
import type { AirspeedIndicatorTraits } from "../generated/contract.js";
import { CX, CY, face, label, niceStep, pointer, rotate, tick } from "./dial.js";

const START = -150;
const SWEEP = 300;

export class AirspeedView extends AeronauticsView<AirspeedIndicatorTraits> {
  readonly valueTraits = ["value"];
  override readonly unitTraits = { unit: "speed", input_unit: "speed" } as const;
  readonly scaleLayer = svg("g", { class: "awf-scale" });
  readonly needle = pointer(78, 4);
  readonly unitText = svg("text", { class: "awf-unit", x: CX, y: CY + 36, "text-anchor": "middle" });

  constructor(model: AnyModel<AirspeedIndicatorTraits>, el: HTMLElement) {
    super(model, el, ["value", "unit", "input_unit", "min", "max", "white_arc", "green_arc", "yellow_arc", "vne"]);
    this.svgEl.append(face(), this.scaleLayer, this.unitText, this.needle, this.readout);
    this.watchValues();
  }

  private speed(v: number): number {
    return convert("speed", v, String(this.get("input_unit")), String(this.get("unit")));
  }

  /** Angle of a speed given in input_unit. */
  angleOf(v: number): number {
    const lo = this.get("min") as number;
    const hi = this.get("max") as number;
    return START + (SWEEP * (clamp(v, lo, hi) - lo)) / (hi - lo || 1);
  }

  describe(): string {
    return `${format("speed", this.speed(this.get("value") as number), String(this.get("unit")))} ${String(this.get("unit"))}`;
  }

  override draw(): void {
    clear(this.scaleLayer);
    const lo = this.get("min") as number;
    const hi = this.get("max") as number;
    if (hi > lo) {
      // arcs (FLT-011): white inside, green and yellow on the rim
      const arcs: Array<[keyof Traits & string, string, number, number]> = [
        ["white_arc", "awf-arc-white", 70, 76],
        ["green_arc", "awf-arc-green", 80, 88],
        ["yellow_arc", "awf-arc-yellow", 80, 88],
      ];
      for (const [name, cls, r0, r1] of arcs) {
        const arc = this.get(name) as [number, number] | null;
        if (arc) this.scaleLayer.append(svg("path", { class: cls, d: sectorPath(CX, CY, r0, r1, this.angleOf(arc[0]), this.angleOf(arc[1])) }));
      }
      // ticks and labels in the displayed unit
      const dlo = this.speed(lo);
      const dhi = this.speed(hi);
      const step = niceStep(dhi - dlo, 8);
      for (let d = Math.ceil(dlo / step) * step; d <= dhi + 1e-9; d += step) {
        const v = lo + ((d - dlo) * (hi - lo)) / (dhi - dlo);
        this.scaleLayer.append(tick(this.angleOf(v), 76, 90, "awf-tick awf-major"), label(String(Math.round(d)), this.angleOf(v), 60));
      }
      const vne = this.get("vne") as number | null;
      if (vne !== null) this.scaleLayer.append(tick(this.angleOf(vne), 74, 92, "awf-vne"));
    }
    this.unitText.textContent = String(this.get("unit"));
    this.needle.style.visibility = this.shows() ? "" : "hidden";
    if (this.shows()) rotate(this.needle, this.angleOf(this.get("value") as number));
  }
}
