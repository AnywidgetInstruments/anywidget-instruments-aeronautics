// Base view of every aeronautics widget. It derives from the base view of the
// anywidget-instruments core (common traits, render scheduling, themes, kernel
// liveness; API-001) and adds what a flight instrument needs: indicators only
// (API-002, API-003), the state of its values (ROB-001, ROB-002), the invalid
// state for rejected traits (ROB-003), the night theme (API-004) and the drawing
// frame shared by the round instruments.
import { readValue } from "anywidget-instruments/js/src/contract/traits.js";
import { setAttr, setText, svg, svgText } from "anywidget-instruments/js/src/core/dom.js";
import type { AnyModel, Traits } from "anywidget-instruments/js/src/core/model.js";
import { BaseView } from "anywidget-instruments/js/src/core/view.js";
import { STATE_TEXT, type ValueState, valueState } from "./state.js";
import { isUnit, type Quantity } from "./units.js";

/** Period of the check of max_age while a widget is displayed (ms). */
export const AGE_CHECK_MS = 250;

export abstract class AeronauticsView<T extends object = Traits> extends BaseView<T> {
  /** Traits holding the values the widget shows (all set, or the widget has no value). */
  abstract readonly valueTraits: readonly string[];
  /** Unit traits and their quantity, checked beyond their schema. */
  readonly unitTraits: Readonly<Record<string, Quantity>> = {};
  protected _updated: number | null = null;
  private _stateNow: ValueState = "missing";
  readonly svgEl: SVGElement;
  readonly readout: SVGElement;

  constructor(model: AnyModel<T>, el: HTMLElement, traits: string[] = []) {
    super(model, el, [...traits, "max_age", "_value_seq"]);
    this.root.classList.add("awf-root", this.kind);
    this.svgEl = svg("svg", { class: "awi-svg awf-instrument", viewBox: "0 0 200 224", "aria-hidden": "true" });
    this.readout = svgText("", { class: "awf-readout", x: 100, y: 217, "text-anchor": "middle" });
    this.body.append(this.svgEl);
    setAttr(this.body, "role", "img");
    const touch = () => {
      this._updated = Date.now();
    };
    this.listen("change:_value_seq", touch);
    // max_age is a matter of time, not of trait changes (ROB-001)
    const timer = setInterval(() => {
      if (Number(this.get("max_age")) > 0 && this.valueState() !== this._stateNow) this.schedule();
    }, AGE_CHECK_MS);
    this._disposers.push(() => clearInterval(timer));
    // API-003: nothing typed or clicked in a widget changes its values
    for (const ev of ["keydown", "wheel", "pointerdown"]) {
      const stop = (e: Event) => e.stopPropagation();
      this.body.addEventListener(ev, stop);
      this._disposers.push(() => this.body.removeEventListener(ev, stop));
    }
  }

  /** Called by subclasses once their value traits are known: their changes count as updates. */
  protected watchValues(): void {
    const raw = this.valueTraits.map((n) => (this.model as unknown as AnyModel<Traits>).get(n));
    this._updated = raw.some((v) => v === null || v === undefined) ? null : Date.now();
    for (const n of this.valueTraits) {
      this.listen(`change:${n}`, () => {
        this._updated = Date.now();
      });
    }
    this.schedule();
  }

  /** Traits whose raw value the schema rejects, and units of another quantity (ROB-003, UNIT-003). */
  invalidTraits(): string[] {
    const out: string[] = [];
    const traits = this.contract?.traits ?? {};
    for (const [name, spec] of Object.entries(traits)) {
      const raw = (this.model as unknown as AnyModel<Traits>).get(name);
      if (raw !== undefined && readValue(spec, raw) === undefined) out.push(name);
    }
    for (const [name, quantity] of Object.entries(this.unitTraits)) {
      if (!out.includes(name) && !isUnit(quantity, this.get(name))) out.push(name);
    }
    return out;
  }

  /** State of the values now (ROB-001 .. ROB-003). */
  valueState(now = Date.now()): ValueState {
    return valueState({
      invalid: this.invalidTraits(),
      values: this.valueTraits.map((n) => this.get(n)),
      maxAge: Number(this.get("max_age")) || 0,
      updated: this._updated,
      now,
    });
  }

  /** Readout text of the values, when their state is ok or stale. */
  abstract describe(): string;

  override renderCommon(): void {
    super.renderCommon();
    const state = this.valueState();
    this._stateNow = state;
    for (const s of ["invalid", "missing", "stale"]) this.root.classList.toggle(`awf-${s}`, state === s);
    // API-004: the night theme is the dark one at a lower luminance
    const night = this.get("theme") === "night";
    if (night) {
      this.root.classList.remove("awi-theme-light");
      this.root.classList.add("awi-theme-dark");
    }
    this.root.classList.toggle("awf-night", night);
    const text = state === "ok" ? this.describe() : state === "stale" ? `${this.describe()} · ${STATE_TEXT.stale}` : STATE_TEXT[state];
    setText(this.readout, text);
    // A11Y-001: the values as text, with their unit
    setAttr(this.body, "aria-label", `${String(this.get("label") || this.kind)}: ${text}`);
  }

  /** True when the values can be drawn (ok or stale). */
  shows(): boolean {
    return this._stateNow === "ok" || this._stateNow === "stale";
  }
}
