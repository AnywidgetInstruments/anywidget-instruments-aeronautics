"""The basic six flight instruments (FLT-001 .. FLT-006, FLT-011 .. FLT-016)."""

from __future__ import annotations

from typing import Any

import traitlets as t
from anywidget_instruments import size_trait

from ._base import AeronauticsWidget

SPEED_UNITS = ("kt", "km/h", "mph")
ALTITUDE_UNITS = ("ft", "m")
VERTICAL_UNITS = ("ft/min", "m/s")
PRESSURE_UNITS = ("hPa", "inHg")


def _num(default: float | None = None, **kw: Any) -> Any:
    if default is None:
        return t.Float(None, allow_none=True, **kw).tag(sync=True)
    return t.Float(default, **kw).tag(sync=True)


def _arc() -> Any:
    return t.List(t.Float(), default_value=None, allow_none=True, minlen=2, maxlen=2).tag(sync=True)


class AirspeedIndicator(AeronauticsWidget):
    """Indicated airspeed with its arcs and never-exceed line (FLT-001, FLT-011).

    ``value``, ``min``, ``max``, the arcs (``[from, to]``) and ``vne`` are in
    ``input_unit``; the dial is drawn in ``unit`` (``"kt"``, ``"km/h"``, ``"mph"``).
    """

    _kind = t.Unicode("awf-airspeed").tag(sync=True)
    size = size_trait(200, 224)
    _default_size = (200, 224)
    label = t.Unicode("Airspeed").tag(sync=True)
    value = _num()
    unit = t.Enum(SPEED_UNITS, default_value="kt").tag(sync=True)
    input_unit = t.Enum(SPEED_UNITS, default_value="kt").tag(sync=True)
    min = _num(0.0)
    max = _num(200.0)
    white_arc = _arc()
    green_arc = _arc()
    yellow_arc = _arc()
    vne = _num()


class AttitudeIndicator(AeronauticsWidget):
    """Pitch and roll around a fixed aircraft symbol (FLT-002, FLT-012), in degrees."""

    _kind = t.Unicode("awf-attitude").tag(sync=True)
    size = size_trait(200, 224)
    _default_size = (200, 224)
    label = t.Unicode("Attitude").tag(sync=True)
    pitch = _num(min=-90.0, max=90.0)
    roll = _num(min=-180.0, max=180.0)
    _value_traits = ("pitch", "roll")


class Altimeter(AeronauticsWidget):
    """Altitude and pressure setting (FLT-003, FLT-013)."""

    _kind = t.Unicode("awf-altimeter").tag(sync=True)
    size = size_trait(200, 224)
    _default_size = (200, 224)
    label = t.Unicode("Altitude").tag(sync=True)
    value = _num()
    unit = t.Enum(ALTITUDE_UNITS, default_value="ft").tag(sync=True)
    input_unit = t.Enum(ALTITUDE_UNITS, default_value="ft").tag(sync=True)
    pressure = _num()
    pressure_unit = t.Enum(PRESSURE_UNITS, default_value="hPa").tag(sync=True)


class TurnCoordinator(AeronauticsWidget):
    """Rate of turn in °/s and slip from -1 to +1 (FLT-004, FLT-014)."""

    _kind = t.Unicode("awf-turn").tag(sync=True)
    size = size_trait(200, 224)
    _default_size = (200, 224)
    label = t.Unicode("Turn").tag(sync=True)
    rate = _num()
    slip = _num(min=-1.0, max=1.0)
    _value_traits = ("rate", "slip")


class HeadingIndicator(AeronauticsWidget):
    """Heading and heading bug in degrees (FLT-005, FLT-015)."""

    _kind = t.Unicode("awf-heading").tag(sync=True)
    size = size_trait(200, 224)
    _default_size = (200, 224)
    label = t.Unicode("Heading").tag(sync=True)
    value = _num()
    bug = _num()


class VerticalSpeedIndicator(AeronauticsWidget):
    """Climb and descent rates (FLT-006, FLT-016); ``max`` is the end of the scale each way."""

    _kind = t.Unicode("awf-vsi").tag(sync=True)
    size = size_trait(200, 224)
    _default_size = (200, 224)
    label = t.Unicode("Vertical speed").tag(sync=True)
    value = _num()
    unit = t.Enum(VERTICAL_UNITS, default_value="ft/min").tag(sync=True)
    input_unit = t.Enum(VERTICAL_UNITS, default_value="ft/min").tag(sync=True)
    max = _num(2000.0)

    @t.validate("max")
    def _positive_max(self, proposal: Any) -> float:
        if proposal["value"] <= 0:
            raise t.TraitError(
                f"The 'max' trait of a {type(self).__name__} instance must be positive"
            )
        return float(proposal["value"])
