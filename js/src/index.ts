// anywidget-instruments-aeronautics front-end entry point (AFM module, GEN-002).
// One bundle serves every widget; the `_kind` trait selects the view.
import { watchModel } from "anywidget-instruments/js/src/core/liveness.js";
import type { AnyModel } from "anywidget-instruments/js/src/core/model.js";
import { registerContracts } from "anywidget-instruments/js/src/core/view.js";
import type { AeronauticsView } from "./core/view.js";
import { BY_KIND } from "./generated/contract.js";
import { AirspeedView } from "./widgets/airspeed.js";
import { AltimeterView } from "./widgets/altimeter.js";
import { AttitudeView } from "./widgets/attitude.js";
import { HeadingView } from "./widgets/heading.js";
import { TurnView } from "./widgets/turn.js";
import { VerticalSpeedView } from "./widgets/vsi.js";

// the base view reads the traits of a widget through the contract of its kind (HOST-002)
registerContracts(BY_KIND);

export type ViewClass = new (model: AnyModel<any>, el: HTMLElement) => AeronauticsView<any>;

export const VIEWS: Record<string, ViewClass> = {
  "awf-airspeed": AirspeedView,
  "awf-attitude": AttitudeView,
  "awf-altimeter": AltimeterView,
  "awf-turn": TurnView,
  "awf-heading": HeadingView,
  "awf-vsi": VerticalSpeedView,
};

function render({ model, el }: { model: AnyModel; el: HTMLElement }): (() => void) | undefined {
  const View = VIEWS[String(model.get("_kind"))];
  if (!View) {
    el.textContent = `anywidget-instruments-aeronautics: unknown widget kind "${String(model.get("_kind"))}"`;
    return undefined;
  }
  const view = new View(model, el);
  return () => view.destroy();
}

// Once per model, even when no view is displayed: kernel heartbeats.
function initialize({ model }: { model: AnyModel }): void {
  watchModel(model);
}

export default { initialize, render };
