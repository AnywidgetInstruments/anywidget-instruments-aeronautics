// AttitudeIndicator (FLT-002, FLT-012): the horizon and the pitch ladder move
// with pitch and roll around a fixed aircraft symbol; ±30° of pitch are in view.
import { svg, svgText } from "anywidget-instruments/js/src/core/dom.js";
import type { AnyModel } from "anywidget-instruments/js/src/core/model.js";
import { clamp } from "anywidget-instruments/js/src/core/scale.js";
import { AeronauticsView } from "../core/view.js";
import type { AttitudeIndicatorTraits } from "../generated/contract.js";
import { CX, CY, face, rotate, tick } from "./dial.js";

/** Pixels per degree of pitch: ±30° fill the radius of the window (FLT-012). */
export const PX_PER_DEG = 2.5;
const BANK_MARKS = [10, 20, 30, 45, 60];

export class AttitudeView extends AeronauticsView<AttitudeIndicatorTraits> {
  readonly valueTraits = ["pitch", "roll"];
  readonly horizon = svg("g", { class: "awf-horizon" });
  readonly bankPointer = svg("path", { class: "awf-bank-pointer", d: `M${CX} ${CY - 74}l-6 10h12Z` });

  constructor(model: AnyModel<AttitudeIndicatorTraits>, el: HTMLElement) {
    super(model, el, ["pitch", "roll"]);
    const clip = `${this.id}-window`;
    // sky and ground far beyond the window, so no edge shows at any attitude
    this.horizon.append(
      svg("rect", { class: "awf-sky", x: -200, y: CY - 400, width: 600, height: 400 }),
      svg("rect", { class: "awf-ground", x: -200, y: CY, width: 600, height: 400 }),
      svg("line", { class: "awf-horizon-line", x1: -200, y1: CY, x2: 400, y2: CY }),
    );
    for (let p = -90; p <= 90; p += 5) {
      if (p === 0) continue;
      const y = CY - p * PX_PER_DEG;
      const half = p % 10 === 0 ? 22 : 11;
      this.horizon.append(svg("line", { class: "awf-ladder", x1: CX - half, y1: y, x2: CX + half, y2: y }));
      if (p % 10 === 0) {
        for (const x of [CX - half - 10, CX + half + 10]) this.horizon.append(svgText(String(Math.abs(p)), { class: "awf-ladder-label", x, y: y + 3.5, "text-anchor": "middle" }));
      }
    }
    const bank = svg("g", { class: "awf-bank-scale" });
    for (const m of BANK_MARKS) for (const s of [-1, 1]) bank.append(tick(s * m, m % 30 === 0 ? 76 : 80, 88));
    bank.append(svg("path", { class: "awf-bank-zero", d: `M${CX} ${CY - 78}l-5 -9h10Z` }));
    this.svgEl.append(
      svg("defs", {}, [svg("clipPath", { id: clip }, [svg("circle", { cx: CX, cy: CY, r: 92 })])]),
      face(),
      svg("g", { "clip-path": `url(#${clip})` }, [this.horizon]),
      bank,
      this.bankPointer,
      // the aircraft symbol never moves
      svg("g", { class: "awf-aircraft" }, [
        svg("path", { d: `M${CX - 48} ${CY}h30l6 7l6 -7h-0M${CX + 48} ${CY}h-30l-6 7l-6 -7` }),
        svg("circle", { cx: CX, cy: CY, r: 2.5 }),
      ]),
      this.readout,
    );
    this.watchValues();
  }

  describe(): string {
    const f = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}°`;
    return `pitch ${f(this.get("pitch") as number)} roll ${f(this.get("roll") as number)}`;
  }

  override draw(): void {
    const shows = this.shows();
    const pitch = shows ? clamp(this.get("pitch") as number, -90, 90) : 0;
    const roll = shows ? (this.get("roll") as number) : 0;
    // the world turns the other way than the aircraft
    this.horizon.setAttribute("transform", `rotate(${(-roll).toFixed(2)} ${CX} ${CY}) translate(0 ${(pitch * PX_PER_DEG).toFixed(2)})`);
    rotate(this.bankPointer, -roll);
    this.bankPointer.style.visibility = shows ? "" : "hidden";
    this.horizon.classList.toggle("awf-unknown", !shows);
  }
}
