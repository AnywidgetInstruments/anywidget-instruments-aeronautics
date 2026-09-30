# Widget catalog

!!! danger "Not for navigation"
    None of these widgets is an aircraft instrument: they are for visualization,
    teaching and simulation, never to fly an aircraft. See the [safety notice](safety.md).

Every widget is an indicator. A host sets its values; the front end converts,
rounds and draws them, and shows **NO VALUE** before the first one, **STALE**
after `max_age` seconds without an update, **INVALID** for a trait its schema
rejects. The pictures are captures of the widgets themselves.

## The basic six

| | Widget | Values | Other traits |
|---|---|---|---|
| ![AirspeedIndicator](img/widgets/airspeed-light.png#only-light){ width="120" }![AirspeedIndicator](img/widgets/airspeed-dark.png#only-dark){ width="120" } | `AirspeedIndicator` (FLT-001, FLT-011) | `value`, in `input_unit` | `unit`, `input_unit` (`kt`, `km/h`, `mph`), `min`, `max`, `white_arc`, `green_arc`, `yellow_arc` (`[from, to]`), `vne` |
| ![AttitudeIndicator](img/widgets/attitude-light.png#only-light){ width="120" }![AttitudeIndicator](img/widgets/attitude-dark.png#only-dark){ width="120" } | `AttitudeIndicator` (FLT-002, FLT-012) | `pitch` (±90°, nose up +), `roll` (±180°, right wing down +) | |
| ![Altimeter](img/widgets/altimeter-light.png#only-light){ width="120" }![Altimeter](img/widgets/altimeter-dark.png#only-dark){ width="120" } | `Altimeter` (FLT-003, FLT-013) | `value`, in `input_unit` | `unit`, `input_unit` (`ft`, `m`), `pressure`, `pressure_unit` (`hPa`, `inHg`) |
| ![TurnCoordinator](img/widgets/turn-light.png#only-light){ width="120" }![TurnCoordinator](img/widgets/turn-dark.png#only-dark){ width="120" } | `TurnCoordinator` (FLT-004, FLT-014) | `rate` (°/s, right +) | `slip` (−1 full left, +1 full right; null hides the ball) |
| ![HeadingIndicator](img/widgets/heading-light.png#only-light){ width="120" }![HeadingIndicator](img/widgets/heading-dark.png#only-dark){ width="120" } | `HeadingIndicator` (FLT-005, FLT-015) | `value` (°, modulo 360) | `bug` (°, null for none) |
| ![VerticalSpeedIndicator](img/widgets/vsi-light.png#only-light){ width="120" }![VerticalSpeedIndicator](img/widgets/vsi-dark.png#only-dark){ width="120" } | `VerticalSpeedIndicator` (FLT-006, FLT-016) | `value`, in `input_unit`, climb + | `unit`, `input_unit` (`ft/min`, `m/s`), `max` |

Common traits, from the core: `label`, `tooltip`, `visible`, `size`, `style`,
`theme` (plus `night`, a dark theme of lowered luminance), and `max_age`.

```python
import anywidget_instruments_aeronautics as aw

aw.VerticalSpeedIndicator(value=-2.5, input_unit="m/s")  # drawn in ft/min: ↓ 490 ft/min
```

## To come

| Widget | Shows | Requirement |
|---|---|---|
| `HorizontalSituationIndicator` | Heading card, course pointer, course deviation | FLT-007 |
| `PrimaryFlightDisplay` | Speed and altitude tapes around an attitude indicator | FLT-008 |
| `InstrumentPanel` | The basic six in the basic T | FLT-009 |
| Engine gauges | Engine speed, manifold pressure, fuel, temperatures | FLT-010 |
