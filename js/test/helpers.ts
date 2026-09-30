// A host without a Python kernel: the model is a plain dictionary of traits,
// as a page, a Julia or a Rust host builds it from the contract.
import { vi } from "vitest";
import widget from "../src/index.js";
import { CONTRACTS } from "../src/generated/contract.js";

export type State = Record<string, unknown>;

export function hostModel(state: State) {
  const traits: State = { ...state };
  const handlers: Record<string, Array<(...a: unknown[]) => void>> = {};
  const fire = (ev: string, ...args: unknown[]) => (handlers[ev] || []).slice().forEach((h) => h(...args));
  return {
    traits,
    get: (k: string) => traits[k],
    set: (k: string, v: unknown) => {
      traits[k] = v;
      fire(`change:${k}`);
    },
    save_changes: () => {},
    on: (ev: string, cb: (...a: unknown[]) => void) => (handlers[ev] ||= []).push(cb),
    off: (ev?: string | null, cb?: ((...a: unknown[]) => void) | null) => {
      if (ev) handlers[ev] = (handlers[ev] || []).filter((h) => h !== cb);
    },
    send: (): void => {},
  };
}

/** Class defaults as a host reads them from the contract, plus the given traits. */
export function defaults(title: keyof typeof CONTRACTS, traits: State = {}): State {
  return { ...Object.fromEntries(Object.entries(CONTRACTS[title].traits).map(([k, s]) => [k, s.default])), ...traits };
}

export function mount(state: State) {
  const model = hostModel(state);
  const el = document.createElement("div");
  document.body.appendChild(el);
  widget.initialize({ model });
  const cleanup = widget.render({ model, el });
  const root = el.querySelector(".awf-root") as HTMLElement;
  const body = el.querySelector(".awi-body") as HTMLElement;
  const readout = () => el.querySelector(".awf-readout")?.textContent;
  return { model, el, root, body, readout, cleanup: () => { cleanup?.(); el.remove(); } };
}

/** Let the scheduled render run (one animation frame, faked by timers). */
export const frame = () => vi.advanceTimersByTimeAsync(40);

/** Angle of a node rotated with rotate(), in degrees. */
export function angle(node: Element | null): number {
  return Number(/rotate\(([-\d.]+)/.exec(node?.getAttribute("transform") ?? "")?.[1] ?? NaN);
}
