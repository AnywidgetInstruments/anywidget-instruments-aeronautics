# anywidget-instruments-aeronautics

Flight instruments for computational notebooks and dashboards: airspeed
indicator, attitude indicator, altimeter, turn coordinator, heading indicator,
vertical speed indicator, and later a horizontal situation indicator, a primary
flight display and engine gauges.

A **TypeScript front end first**, built on [anywidget](https://anywidget.dev) and on
[anywidget-instruments](https://github.com/AnywidgetInstruments/anywidget-instruments),
the core of the family, whose base view, trait contract, themes and liveness it
reuses. Everything a widget shows, unit conversion included, is computed in the
front end from its traits, so it behaves alike from Python, Julia or any host
that sets those traits.

> **Status: design stage.** The [specification](docs/specification.md) comes
> first; no widget is written yet. [`docs/requirements-status.md`](docs/requirements-status.md)
> tracks what is done.

> **Not for navigation.** These widgets are for visualization, teaching and
> simulation. They are not certified avionics and must never be used to fly an
> aircraft. Read the [safety notice](docs/safety.md).

## Why a separate library

Flight instruments follow conventions of their own: the arrangement of the
basic six in a "T", the airspeed arcs and marks, a barometric setting on the
altimeter, an attitude indicator whose horizon moves while the aircraft symbol
stays fixed, and units that differ from road and plant (knots, feet, feet per
minute, hectopascals or inches of mercury). They belong in their own package,
built on the same core as
[anywidget-instruments-industrial](https://github.com/AnywidgetInstruments/anywidget-instruments-industrial)
and [anywidget-instruments-automotive](https://github.com/AnywidgetInstruments/anywidget-instruments-automotive).

## Related projects

| Project | What it is | Documentation |
|---|---|---|
| [anywidget-instruments](https://github.com/AnywidgetInstruments/anywidget-instruments) | Core of the family: base view and class, trait contract, themes, liveness | <https://anywidgetinstruments.github.io/anywidget-instruments/> |
| [anywidget-instruments-industrial](https://github.com/AnywidgetInstruments/anywidget-instruments-industrial) | Instrumentation widgets: gauges, tanks, LEDs, switches, charts, alarms, SCADA objects | <https://anywidgetinstruments.github.io/anywidget-instruments-industrial/> |
| [anywidget-instruments-automotive](https://github.com/AnywidgetInstruments/anywidget-instruments-automotive) | Automotive instruments: speedometer, tachometer, tell-tales, cluster | <https://anywidgetinstruments.github.io/anywidget-instruments-automotive/> |
| [afm-host-panel](https://github.com/AnywidgetInstruments/afm-host-panel) | Grafana panel plugin that runs anywidget modules | <https://anywidgetinstruments.github.io/afm-host-panel/> |

## License

BSD-3-Clause (see `LICENSE`).
