# Try it in the browser

The demo is a [marimo](https://marimo.io) reactive app that runs in your browser:
Python runs through Pyodide, so there is nothing to install. The first load
downloads the Python runtime and takes a few seconds.

!!! danger "Not for navigation"
    The demo simulates flight instruments for teaching; they are not certified
    avionics and must never be used to fly an aircraft. See the
    [safety notice](safety.md).

| Demo | What it shows |
|---|---|
| <a href="../marimo/flight/">**Flight instruments**</a> | The basic six in the basic T, driven by sliders; the turn coordinator follows the rate of turn that the bank gives at the airspeed |

The package is not on the package index yet: the demo installs the wheels built with
this site, of the anywidget-instruments core first, then of this library. Locally, with
the packages installed: `marimo edit lite/marimo/flight.py`.
