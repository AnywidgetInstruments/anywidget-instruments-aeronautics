// Drawing helpers shared by the round flight instruments: a face, ticks and
// labels around it, and a pointer rotated about the centre. Angles are in
// degrees clockwise from 12 o'clock, as in the scale helpers of the core.
import { svg, svgText } from "anywidget-instruments/js/src/core/dom.js";
import { polar } from "anywidget-instruments/js/src/core/scale.js";

export const CX = 100;
export const CY = 100;

/** The bezel and face of an instrument. */
export function face(): SVGElement {
  return svg("g", { class: "awf-face" }, [
    svg("circle", { class: "awf-bezel", cx: CX, cy: CY, r: 98 }),
    svg("circle", { class: "awf-dial", cx: CX, cy: CY, r: 92 }),
  ]);
}

/** A tick from radius r0 to r1 at `angle`. */
export function tick(angle: number, r0: number, r1: number, cls = "awf-tick"): SVGElement {
  const [x0, y0] = polar(CX, CY, r0, angle);
  const [x1, y1] = polar(CX, CY, r1, angle);
  return svg("line", { class: cls, x1: x0.toFixed(2), y1: y0.toFixed(2), x2: x1.toFixed(2), y2: y1.toFixed(2) });
}

/** A label at radius r and `angle`, upright. */
export function label(text: string, angle: number, r: number, cls = "awf-label"): SVGElement {
  const [x, y] = polar(CX, CY, r, angle);
  return svgText(text, { class: cls, x: x.toFixed(2), y: (y + 4).toFixed(2), "text-anchor": "middle" });
}

/** A pointer from the hub to radius `length`, drawn pointing up; rotate it with `rotate()`. */
export function pointer(length: number, width: number, cls = "awf-pointer"): SVGElement {
  return svg("g", { class: cls }, [
    svg("path", { d: `M${CX - width} ${CY + 12}L${CX - width / 3} ${CY - length}L${CX + width / 3} ${CY - length}L${CX + width} ${CY + 12}Z` }),
    svg("circle", { class: "awf-hub", cx: CX, cy: CY, r: 5 }),
  ]);
}

/** Turn a pointer or a card to `angle`. */
export function rotate(node: SVGElement, angle: number): void {
  node.setAttribute("transform", `rotate(${angle.toFixed(2)} ${CX} ${CY})`);
}

/** Nice step of ticks for a range: 1, 2 or 5 times a power of ten, about `count` of them. */
export function niceStep(span: number, count: number): number {
  const raw = span / count;
  const p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? 10 * p;
}
