# anywidget-instruments-aeronautics

Flight instruments for computational notebooks and dashboards, in the
anywidget-instruments family: airspeed indicator, attitude indicator, altimeter, turn
coordinator, heading indicator, vertical speed indicator, and later a horizontal
situation indicator, a primary flight display and engine gauges.

!!! danger "Not for navigation"
    These widgets are for visualization, teaching and simulation. They are not
    certified avionics and must never be used to fly an aircraft. Read the
    [safety notice](safety.md).

The basic six are written: airspeed, attitude, altimeter, turn coordinator, heading
and vertical speed (see the [widget catalog](widgets.md)); the HSI, the primary flight
display and the engine gauges are to come. It is a TypeScript front end first, built
on the
[anywidget-instruments](https://anywidgetinstruments.github.io/anywidget-instruments/)
core, as [anywidget-instruments-industrial](https://anywidgetinstruments.github.io/anywidget-instruments-industrial/)
and [anywidget-instruments-automotive](https://anywidgetinstruments.github.io/anywidget-instruments-automotive/)
are: everything a widget shows is computed in the front end from its traits, so it
behaves alike from Python, Julia or a page with no kernel.

- [Widget catalog](widgets.md) and [a demo in your browser](try.md)
- [Safety notice](safety.md)
- [Standards and references](standards.md)
- [Specification](specification.md) and [requirements status](requirements-status.md)
