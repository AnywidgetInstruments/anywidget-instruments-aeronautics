"""Flight instruments for computational notebooks, built on the anywidget-instruments core.

Not certified avionics and not for navigation: see the safety notice.
"""

from __future__ import annotations

from ._base import THEMES, AeronauticsWidget
from ._widgets import (
    ALTITUDE_UNITS,
    PRESSURE_UNITS,
    SPEED_UNITS,
    VERTICAL_UNITS,
    AirspeedIndicator,
    Altimeter,
    AttitudeIndicator,
    HeadingIndicator,
    TurnCoordinator,
    VerticalSpeedIndicator,
)

__version__ = "0.1.0.dev0"

__all__ = [
    "ALTITUDE_UNITS",
    "PRESSURE_UNITS",
    "SPEED_UNITS",
    "THEMES",
    "VERTICAL_UNITS",
    "AeronauticsWidget",
    "AirspeedIndicator",
    "Altimeter",
    "AttitudeIndicator",
    "HeadingIndicator",
    "TurnCoordinator",
    "VerticalSpeedIndicator",
]
