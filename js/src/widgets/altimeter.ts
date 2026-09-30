// Altimeter (FLT-003, FLT-013): the long pointer turns once per 1000 units, the
// short one once per 10 000; the altitude as a figure and the pressure setting.
import { setText, svg, svgText } from "anywidget-instruments/js/src/core/dom.js";
import type { AnyModel } from "anywidget-instruments/js/src/core/model.js";
import { convert, format } from "../core/units.js";
import { AeronauticsView } from "../core/view.js";
import type { AltimeterTraits } from "../generated/contract.js";
import { CX, CY, face, label, pointer, rotate, tick } from "./dial.js";

export class AltimeterView extends AeronauticsView<AltimeterTraits> {
  readonly valueTraits = ["value"];
  override readonly unitTraits = { unit: "altitude", input_unit: "altitude" } as const;
  readonly hundreds = pointer(80, 3.5, "awf-pointer awf-hundreds");
  readonly thousands = pointer(50, 6, "awf-pointer awf-thousands");
  readonly window = svgText("", { class: "awf-window", x: CX, y: CY + 33, "text-anchor": "middle" });
  readonly unitText = svgText("", { class: "awf-unit", x: CX, y: CY - 26, "text-anchor": "middle" });

  constructor(model: AnyModel<AltimeterTraits>, el: HTMLElement) {
    super(model, el, ["value", "unit", "input_unit", "pressure", "pressure_unit"]);
    const scale = svg("g", { class: "awf-scale" });
    for (let i = 0; i < 50; i++) scale.append(tick(i * 7.2, i % 5 === 0 ? 76 : 84, 90, i % 5 === 0 ? "awf-tick awf-major" : "awf-tick"));
    for (let d = 0; d < 10; d++) scale.append(label(String(d), d * 36, 64, "awf-label awf-digit"));
    this.svgEl.append(face(), scale, svg("rect", { class: "awf-window-frame", x: CX - 22, y: CY + 20, width: 44, height: 18, rx: 2 }), this.window, this.unitText, this.thousands, this.hundreds, this.readout);
    this.watchValues();
  }

  private altitude(): number {
    return convert("altitude", this.get("value") as number, String(this.get("input_unit")), String(this.get("unit")));
  }

  describe(): string {
    return `${format("altitude", this.altitude(), String(this.get("unit")))} ${String(this.get("unit"))}`;
  }

  override draw(): void {
    const shows = this.shows();
    for (const p of [this.hundreds, this.thousands]) p.style.visibility = shows ? "" : "hidden";
    if (shows) {
      const a = this.altitude();
      rotate(this.hundreds, (((a % 1000) + 1000) % 1000) * 0.36);
      rotate(this.thousands, (((a % 10000) + 10000) % 10000) * 0.036);
    }
    const p = this.get("pressure") as number | null;
    const pu = String(this.get("pressure_unit"));
    setText(this.window, p === null ? "" : `${format("pressure", p, pu)}`);
    setText(this.unitText, `${String(this.get("unit"))}${p === null ? "" : ` · ${pu}`}`);
  }
}
