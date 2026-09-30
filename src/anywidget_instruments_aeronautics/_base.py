"""Base class of every aeronautics widget (API-001 .. API-004, ROB-001).

A host binding only sets traits: everything a widget displays is computed by
the front end (GEN-003), so this module holds no conversion and no rounding.
"""

from __future__ import annotations

import pathlib
from typing import Any

import traitlets as t
from anywidget_instruments import InstrumentWidget

_STATIC = pathlib.Path(__file__).parent / "static"

#: The themes of the core and the night theme (API-004).
THEMES = ("auto", "light", "dark", "system", "night")


class AeronauticsWidget(InstrumentWidget):
    """Base class of the widgets of anywidget-instruments-aeronautics.

    It keeps the common traits of the core (``label``, ``tooltip``, ``visible``,
    ``size``, ``style``, ``theme``) and adds ``max_age``: seconds after which a
    value not updated is shown as stale (0: never, ROB-001).

    Every widget is an indicator: nothing is meant to be operated in flight.
    These widgets are not certified avionics and are not for navigation.
    """

    _esm = _STATIC / "index.js"
    _css = _STATIC / "index.css"

    mode = t.Enum(["indicator"], default_value="indicator").tag(sync=True)
    theme = t.Enum(THEMES, default_value="auto").tag(sync=True)
    max_age = t.Float(0.0, min=0.0).tag(sync=True)
    #: Incremented on every assignment of a value, even an unchanged one: the
    #: front end counts ``max_age`` from the last update, not the last change.
    _value_seq = t.Int(0, min=0).tag(sync=True)

    _default_mode = "indicator"
    #: Traits holding the values the widget shows.
    _value_traits: tuple[str, ...] = ("value",)

    def __setattr__(self, name: str, value: Any) -> None:
        super().__setattr__(name, value)
        if name in self._value_traits:
            super().__setattr__("_value_seq", self._value_seq + 1)
