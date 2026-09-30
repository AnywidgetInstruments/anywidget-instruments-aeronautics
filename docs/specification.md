# Specification

## Document Metadata

| Field | Value |
|-------|-------|
| Project | anywidget-instruments-aeronautics |
| Author | Sébastien Celles |
| Document type | Software requirements specification |
| Notation | EARS (Easy Approach to Requirements Syntax); priorities MoSCoW: **M** must, **S** should, **C** could, **W** won't (this time) |
| Version | 0.2 |
| Date | 2026-09-30 |
| Status | Draft, foundations and basic six in implementation |

## 1. Introduction

### 1.1 Purpose

This document specifies a library of flight instruments for computational notebooks
and dashboards, in the anywidget-instruments family. It is written before the code: each
widget, trait and behaviour is stated here first.

### 1.2 Scope

**Included:** the basic six flight instruments, a horizontal situation indicator, a
primary flight display arranging tapes around an attitude indicator, engine gauges,
unit systems for aviation, and the hosts of the family (Python, Julia, pages with no
kernel, Grafana).

**Excluded:** navigation, flight planning, terrain or traffic displays, anything meant
to be operated or relied upon in flight, and any claim of certification.

### 1.3 Glossary

| Term | Meaning |
|---|---|
| Basic six | Airspeed, attitude, altimeter, turn coordinator, heading, vertical speed indicators |
| Basic T | The arrangement of airspeed, attitude, altitude and heading around the attitude indicator |
| Pressure setting | The barometric reference set on the altimeter (QNH, QFE or standard) |
| Tape | A vertical moving scale of a primary flight display |
| Core | anywidget-instruments, the base package of the family |

## 2. General (GEN)

| ID | Pri | Requirement |
|---|---|---|
| GEN-001 | M | The library shall implement every widget as an anywidget front-end module written in TypeScript, building on the anywidget-instruments core and on no other widget library of the family. |
| GEN-002 | M | The library shall ship its front end as one pre-bundled ES module and one stylesheet, so that no host needs a JavaScript toolchain. |
| GEN-003 | M | The library shall compute in the front end everything a widget displays — unit conversion, rounding, arcs, stale and missing states — so that every host shows the same figures for the same traits. |
| GEN-004 | M | The library shall load no resource from the network at runtime. |
| GEN-005 | M | The library shall be released under the BSD 3-Clause license. |
| GEN-006 | M | The library shall provide a Python host binding, distributed as a package depending on the anywidget-instruments core, and supporting CPython 3.10 and later. |
| GEN-007 | M | Every concrete widget shall fix its `_kind` with a value starting with `awf-`. |

## 3. Common behaviour (API)

| ID | Pri | Requirement |
|---|---|---|
| API-001 | M | Every widget shall derive from the base view and the base class of the core, with their common traits (`label`, `tooltip`, `visible`, `size`, `style`, `theme`). |
| API-002 | M | Every widget shall be an indicator: its `mode` shall be `"indicator"` only. |
| API-003 | M | While a widget is displayed, the widget shall ignore pointer and keyboard input that would change its value. |
| API-004 | S | Every widget shall accept the themes of the core and a `night` theme of lowered luminance. |

## 4. Flight instruments (FLT)

| ID | Pri | Requirement |
|---|---|---|
| FLT-001 | M | The library shall provide an `AirspeedIndicator` showing indicated airspeed on a dial, with colour arcs given as traits (for example flap operating range, normal operating range, caution range) and a never-exceed mark. |
| FLT-002 | M | The library shall provide an `AttitudeIndicator` whose horizon and pitch ladder move with `pitch` and `roll` while the aircraft symbol stays fixed, with a bank angle scale and pointer. |
| FLT-003 | M | The library shall provide an `Altimeter` showing altitude with a hundreds pointer, a thousands pointer or drum, and the pressure setting in a window. |
| FLT-004 | M | The library shall provide a `TurnCoordinator` showing the rate of turn against standard-rate marks and the slip or skid as an inclinometer ball. |
| FLT-005 | M | The library shall provide a `HeadingIndicator` whose compass card rotates with `heading`, with an optional heading bug. |
| FLT-006 | M | The library shall provide a `VerticalSpeedIndicator` showing climb and descent rates on a scale that is not linear near zero. |
| FLT-007 | S | The library shall provide a `HorizontalSituationIndicator` combining a heading card, a course pointer and a course deviation bar. |
| FLT-008 | S | The library shall provide a `PrimaryFlightDisplay` arranging an airspeed tape, an attitude indicator, an altitude tape, a vertical speed scale and a heading scale. |
| FLT-009 | S | The library shall provide an `InstrumentPanel` placing the basic six in the basic T arrangement. |
| FLT-010 | C | The library shall provide engine gauges: engine speed, manifold pressure, fuel quantity and fuel flow, exhaust gas and cylinder head temperatures. |
| FLT-011 | M | The `AirspeedIndicator` shall draw its arcs from the traits `white_arc`, `green_arc` and `yellow_arc` (each `[from, to]` in `input_unit`, or null for none) and a red radial line at `vne`. |
| FLT-012 | M | The `AttitudeIndicator` shall show ±30° of pitch around the horizon line, with a pitch ladder marked every 5° and labelled every 10°, and a bank scale marked at 10°, 20°, 30°, 45° and 60° on each side; `pitch` shall be read within ±90° and `roll` within ±180°. |
| FLT-013 | M | The `Altimeter` shall show the hundreds on the long pointer (one turn per 1000 units) and the thousands on the short pointer (one turn per 10 000 units), with the altitude as a figure, and the pressure setting in its window. |
| FLT-014 | M | The `TurnCoordinator` shall bank its aircraft symbol by 20° at the standard rate of 3°/s, with marks at the standard rate on each side, limited to 1.5 times the standard rate, and move its ball with `slip` (−1 full left, +1 full right). |
| FLT-015 | M | The `HeadingIndicator` shall rotate its card so that `heading` (read modulo 360) is under the lubber line, and draw the heading bug at `bug` when it is set. |
| FLT-016 | M | The `VerticalSpeedIndicator` shall show zero at 9 o'clock, climbs above and descents below, over 170° each way, the first half of the range (`max`) over 60% of that arc. |

## 5. Units (UNIT)

| ID | Pri | Requirement |
|---|---|---|
| UNIT-001 | M | The library shall accept speeds in knots, kilometres per hour or miles per hour; altitudes in feet or metres; vertical speeds in feet per minute or metres per second; pressure settings in hectopascals or inches of mercury. |
| UNIT-002 | M | The widget shall convert the value from its input unit to its displayed unit in the front end, with exact conversion factors: 1 kt = 1852/3600 m/s, 1 mph = 1609.344/3600 m/s, 1 ft = 0.3048 m, 1 ft/min = 0.00508 m/s, 1 inHg = 3386.389 Pa. |
| UNIT-003 | M | If a host sets a unit the widget does not accept for its quantity, then the widget shall show an invalid state rather than a figure. |

## 6. Robustness (ROB)

| ID | Pri | Requirement |
|---|---|---|
| ROB-001 | M | If a value is older than `max_age`, then the widget shall show it as stale. |
| ROB-002 | M | While no value has been received, the widget shall show a missing state rather than a zero, a level horizon or a centred needle. |
| ROB-003 | M | If a host sets a trait to a value its schema rejects, then the widget shall show an invalid state rather than a guessed figure. |
| ROB-004 | M | When the kernel stops sending heartbeats, the widget shall show the stale indication of the core. |

## 7. Accessibility (A11Y)

| ID | Pri | Requirement |
|---|---|---|
| A11Y-001 | M | Every widget shall expose its value as text to assistive technologies, with its unit. |
| A11Y-002 | M | Every state conveyed by colour (arcs, stale, missing, invalid) shall also be conveyed by shape or text. |
| A11Y-003 | S | Where the user agent requests reduced motion, the widgets shall not animate their pointers or cards. |

## 8. Documentation and safety (DOC)

| ID | Pri | Requirement |
|---|---|---|
| DOC-001 | M | The documentation shall state that the library is not certified avionics, is not for navigation and must never be used to fly an aircraft, and every widget page shall show that notice. |
| DOC-002 | M | The documentation shall list the documents whose conventions the library follows, and state that it claims no conformity with any of them. |
| DOC-003 | S | Every widget shall be pictured in the light and the dark theme, captured from the widget itself. |

## 9. Open questions

1. Resolved (0.2): FLT-012. Chevrons for unusual attitudes are not planned (W).
2. Resolved (0.2): FLT-016.
3. Speed and altitude trend vectors on the `PrimaryFlightDisplay` are not planned (W).

## Revision History

| Version | Changes |
|---|---|
| 0.1 | First draft: general, common behaviour, flight instruments, units, robustness, accessibility, documentation and safety. |
| 0.2 | FLT-011 .. FLT-016: the traits and drawing of the basic six; UNIT-002: the conversion factors; open questions 1 to 3 resolved. |
