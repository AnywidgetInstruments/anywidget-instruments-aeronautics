# Safety notice

!!! danger "Not for navigation"
    anywidget-instruments-aeronautics is a library for **visualization, teaching and
    simulation in notebooks and dashboards**. Its widgets are not certified avionics,
    are not designed or verified according to the processes that apply to airborne
    software and equipment, and **must never be used to fly an aircraft**, to navigate,
    or in place of an aircraft's own instruments.

## It does not replace the aircraft's instruments

The instruments of an aircraft are approved equipment, installed and maintained under
rules that a notebook widget follows none of:

* a widget drawing an airspeed indicator shows the value it is given, late or wrong as
  that value may be; it never measures anything;
* a level horizon, a zero vertical speed or a steady heading on a widget does not mean
  the aircraft is flying level: it means the code feeding the widget said so;
* data read from a simulator, a log or a network arrives late and can be stale; the
  stale and missing states of the widgets reduce the risk of reading an old value, but
  are no guarantee.

## In the aircraft

Do not use a notebook, a dashboard or a page built with these widgets in flight to take
any decision. A passenger or a student may watch a replay on the ground; the pilot flies
with the aircraft's instruments.

## Simulation and teaching

The widgets suit flight simulators, replays of recorded flights, lessons on how the
instruments work and their failure modes, and dashboards of ground tests. Even there,
state on the page that the display is not an aircraft instrument.
