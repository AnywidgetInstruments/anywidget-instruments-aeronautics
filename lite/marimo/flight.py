# Flight instruments — a marimo notebook of the documentation site, exported to
# WebAssembly: it runs in the browser through Pyodide, with the wheels of this library
# and of the anywidget-instruments core published next to the page (public/). Locally,
# with the packages installed: `marimo edit lite/marimo/flight.py`.
#
# The page follows the reader's light or dark preference, as the widgets do.
# /// script
# [tool.marimo.display]
# theme = "system"
# ///
import marimo

__generated_with = "0.25.0"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _():
    import math
    import sys

    import marimo as mo

    return math, mo, sys


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    [⬅ Back to the documentation](https://anywidgetinstruments.github.io/anywidget-instruments-aeronautics/widgets/)

    # Flight instruments

    The basic six in the basic T. Set the airspeed, the altitude, the vertical speed,
    the heading, the bank and the pitch: the turn coordinator follows the rate of turn
    that the bank gives at that airspeed, and the ball the slip you set.

    > **Not for navigation.** These widgets are not certified avionics; see the
    > [safety notice](https://anywidgetinstruments.github.io/anywidget-instruments-aeronautics/safety/).
    """)
    return


@app.cell(hide_code=True)
async def _(mo, sys):
    # In the browser the packages are not on the package index: install the wheels built
    # with the site, the anywidget-instruments core first. Locally they are installed.
    if sys.platform == "emscripten":
        import micropip
        from pyodide.http import pyfetch

        _base = mo.notebook_location() / "public"
        for _wheel in (await (await pyfetch(str(_base / "wheels.txt"))).string()).split():
            await micropip.install(str(_base / _wheel))
    installed = True
    return (installed,)


@app.cell(hide_code=True)
def _(installed, mo):
    assert installed
    speed = mo.ui.slider(40, 180, value=105, label="Airspeed (kt)")
    altitude = mo.ui.slider(0, 12000, step=50, value=3500, label="Altitude (ft)")
    vs = mo.ui.slider(-2000, 2000, step=50, value=300, label="Vertical speed (ft/min)")
    heading = mo.ui.slider(0, 359, value=275, label="Heading (°)")
    bank = mo.ui.slider(-45, 45, value=-15, label="Bank (°, right +)")
    pitch = mo.ui.slider(-20, 20, step=0.5, value=5, label="Pitch (°, nose up +)")
    slip = mo.ui.slider(-1, 1, step=0.05, value=0, label="Slip")
    mo.vstack([mo.hstack([speed, altitude, vs]), mo.hstack([heading, bank, pitch, slip])])
    return altitude, bank, heading, pitch, slip, speed, vs


@app.cell(hide_code=True)
def _(installed):
    assert installed
    import anywidget_instruments_aeronautics as aw

    asi = aw.AirspeedIndicator(
        white_arc=[45, 85], green_arc=[55, 130], yellow_arc=[130, 163], vne=163
    )
    ai = aw.AttitudeIndicator()
    alt = aw.Altimeter(pressure=1013)
    tc = aw.TurnCoordinator()
    hi = aw.HeadingIndicator(bug=300)
    vsi = aw.VerticalSpeedIndicator()
    return ai, alt, asi, hi, tc, vsi


@app.cell(hide_code=True)
def _(ai, alt, altitude, asi, bank, heading, hi, math, pitch, slip, speed, tc, vs, vsi):
    asi.value = speed.value
    ai.pitch, ai.roll = pitch.value, bank.value
    alt.value = altitude.value
    vsi.value = vs.value
    hi.value = heading.value
    # rate of turn of a coordinated turn: g tan(bank) / V, in degrees per second
    _v = speed.value * 1852 / 3600
    tc.rate = math.degrees(9.80665 * math.tan(math.radians(bank.value)) / _v)
    tc.slip = slip.value
    return


@app.cell(hide_code=True)
def _(ai, alt, asi, hi, mo, tc, vsi):
    # the basic T: airspeed, attitude, altitude above; turn, heading, vertical speed below
    mo.vstack(
        [mo.hstack([asi, ai, alt], justify="start"), mo.hstack([tc, hi, vsi], justify="start")]
    )
    return


if __name__ == "__main__":
    app.run()
