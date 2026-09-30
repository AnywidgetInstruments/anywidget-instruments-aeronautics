"""Behaviour of the Python binding: traits only, no conversion (GEN-003)."""

from __future__ import annotations

import pytest
import traitlets as t

import anywidget_instruments_aeronautics as aw


def test_each_assignment_of_a_value_counts_as_an_update() -> None:
    w = aw.AirspeedIndicator(value=90)
    seq = w._value_seq
    w.value = 90  # unchanged, still an update (ROB-001)
    assert w._value_seq == seq + 1


def test_both_values_of_the_attitude_count_as_updates() -> None:
    w = aw.AttitudeIndicator()
    w.pitch = 3
    w.roll = -5
    assert w._value_seq == 2


def test_units_are_checked() -> None:
    with pytest.raises(t.TraitError):
        aw.AirspeedIndicator(unit="knots")
    with pytest.raises(t.TraitError):
        aw.Altimeter(pressure_unit="mb")


def test_attitude_and_slip_are_bounded() -> None:
    with pytest.raises(t.TraitError):
        aw.AttitudeIndicator(pitch=120)
    with pytest.raises(t.TraitError):
        aw.TurnCoordinator(slip=2)


def test_arcs_are_pairs() -> None:
    w = aw.AirspeedIndicator(green_arc=[50, 130])
    assert w.green_arc == [50, 130]
    with pytest.raises(t.TraitError):
        aw.AirspeedIndicator(green_arc=[50])


def test_the_vsi_scale_is_positive() -> None:
    with pytest.raises(t.TraitError):
        aw.VerticalSpeedIndicator(max=0)


def test_the_night_theme() -> None:
    assert aw.HeadingIndicator(theme="night").theme == "night"
