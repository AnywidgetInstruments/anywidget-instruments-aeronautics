// HeadingIndicator (FLT-005, FLT-015): the card turns so that the heading is
// under the lubber line; the heading bug turns with the card.
import { svg } from "anywidget-instruments/js/src/core/dom.js";
import type { AnyModel } from "anywidget-instruments/js/src/core/model.js";
import { AeronauticsView } from "../core/view.js";
import type { HeadingIndicatorTraits } from "../generated/contract.js";
import { CX, CY, face, label, rotate, tick } from "./dial.js";

const CARDINAL: Record<number, string> = { 0: "N", 90: "E", 180: "S", 270: "W" };

export class HeadingView extends AeronauticsView<HeadingIndicatorTraits> {
  readonly valueTraits = ["value"];
  readonly card = svg("g", { class: "awf-card" });
  readonly bug = svg("path", { class: "awf-bug", d: `M${CX - 7} ${CY - 92}h14v8l-7 -5l-7 5Z` });

  constructor(model: AnyModel<HeadingIndicatorTraits>, el: HTMLElement) {
    super(model, el, ["value", "bug"]);
    for (let d = 0; d < 360; d += 5) this.card.append(tick(d, d % 10 === 0 ? 74 : 80, 88, d % 30 === 0 ? "awf-tick awf-major" : "awf-tick"));
    for (let d = 0; d < 360; d += 30) this.card.append(label(CARDINAL[d] ?? String(d / 10), d, 62, CARDINAL[d] ? "awf-label awf-cardinal" : "awf-label"));
    this.card.append(this.bug);
    this.svgEl.append(
      face(),
      this.card,
      svg("path", { class: "awf-lubber", d: `M${CX} ${CY - 90}l-5 -8h10Z` }),
      svg("path", { class: "awf-aircraft", d: `M${CX} ${CY - 26}v52M${CX - 22} ${CY - 2}h44M${CX - 10} ${CY + 22}h20` }),
      this.readout,
    );
    this.watchValues();
  }

  describe(): string {
    const h = Math.round(this.get("value") as number) % 360;
    return `${String(h).padStart(3, "0")}°`;
  }

  override draw(): void {
    const shows = this.shows();
    rotate(this.card, shows ? -(this.get("value") as number) : 0);
    this.card.classList.toggle("awf-unknown", !shows);
    const bug = this.get("bug") as number | null;
    this.bug.style.visibility = bug === null ? "hidden" : "";
    if (bug !== null) rotate(this.bug, bug);
  }
}
