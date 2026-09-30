// TurnCoordinator (FLT-004, FLT-014): the aircraft symbol banks 20° at the
// standard rate of 3°/s, up to 1.5 times it; the ball shows slip or skid.
import { svg, svgText } from "anywidget-instruments/js/src/core/dom.js";
import type { AnyModel } from "anywidget-instruments/js/src/core/model.js";
import { clamp } from "anywidget-instruments/js/src/core/scale.js";
import { AeronauticsView } from "../core/view.js";
import type { TurnCoordinatorTraits } from "../generated/contract.js";
import { CX, CY, face, rotate, tick } from "./dial.js";

export const STANDARD_RATE = 3;
export const STANDARD_BANK = 20;
/** Horizontal travel of the ball at full deflection, in drawing units. */
const BALL_TRAVEL = 34;

/** Bank of the aircraft symbol for a rate of turn (FLT-014). */
export function symbolBank(rate: number): number {
  return clamp(rate / STANDARD_RATE, -1.5, 1.5) * STANDARD_BANK;
}

export class TurnView extends AeronauticsView<TurnCoordinatorTraits> {
  readonly valueTraits = ["rate"];
  readonly symbol = svg("g", { class: "awf-aircraft awf-turn-symbol" }, [
    svg("path", { d: `M${CX - 56} ${CY}h112M${CX} ${CY - 10}v12M${CX - 12} ${CY + 14}h24` }),
    svg("circle", { cx: CX, cy: CY, r: 5 }),
  ]);
  readonly ball = svg("circle", { class: "awf-ball", cx: CX, cy: CY + 54, r: 7 });

  constructor(model: AnyModel<TurnCoordinatorTraits>, el: HTMLElement) {
    super(model, el, ["rate", "slip"]);
    const marks = svg("g", { class: "awf-scale" }, [
      tick(-90, 70, 88, "awf-tick awf-major"),
      tick(90, 70, 88, "awf-tick awf-major"),
      tick(-90 - STANDARD_BANK, 70, 88, "awf-tick awf-major"),
      tick(90 + STANDARD_BANK, 70, 88, "awf-tick awf-major"),
      svgText("L", { class: "awf-label", x: CX - 66, y: CY + 36, "text-anchor": "middle" }),
      svgText("R", { class: "awf-label", x: CX + 66, y: CY + 36, "text-anchor": "middle" }),
      svgText("2 MIN", { class: "awf-note", x: CX, y: CY + 32, "text-anchor": "middle" }),
    ]);
    const tube = svg("path", { class: "awf-tube", d: `M${CX - BALL_TRAVEL - 10} ${CY + 50}Q${CX} ${CY + 64} ${CX + BALL_TRAVEL + 10} ${CY + 50}` });
    this.svgEl.append(
      face(),
      marks,
      tube,
      svg("line", { class: "awf-tube-mark", x1: CX - 9, y1: CY + 44, x2: CX - 9, y2: CY + 64 }),
      svg("line", { class: "awf-tube-mark", x1: CX + 9, y1: CY + 44, x2: CX + 9, y2: CY + 64 }),
      this.ball,
      this.symbol,
      this.readout,
    );
    this.watchValues();
  }

  describe(): string {
    const r = this.get("rate") as number;
    return `${r > 0 ? "right" : r < 0 ? "left" : "level"} ${Math.abs(r).toFixed(1)} °/s`;
  }

  override draw(): void {
    const shows = this.shows();
    rotate(this.symbol, shows ? symbolBank(this.get("rate") as number) : 0);
    this.symbol.classList.toggle("awf-unknown", !shows);
    const slip = this.get("slip") as number | null;
    this.ball.style.visibility = slip === null ? "hidden" : "";
    if (slip !== null) this.ball.setAttribute("cx", (CX + clamp(slip, -1, 1) * BALL_TRAVEL).toFixed(2));
  }
}
