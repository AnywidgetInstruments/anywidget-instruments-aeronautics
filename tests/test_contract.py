"""The Python classes and the trait contract agree (HOST-001, GEN-006)."""

from __future__ import annotations

import json
import pathlib
from typing import Any

import pytest

import anywidget_instruments_aeronautics as aw

PKG = pathlib.Path(aw.__file__).parent
CONTRACT_FILE = PKG / "static" / "contract.json"

if not CONTRACT_FILE.exists():  # pragma: no cover - the bundle is built before the tests
    pytest.skip("static/contract.json missing: run `npm run build`", allow_module_level=True)

CONTRACT = json.loads(CONTRACT_FILE.read_text())
FRAMEWORK = set(CONTRACT["frameworkTraits"])
CONCRETE = {name: w for name, w in CONTRACT["widgets"].items() if not w["abstract"]}


def _json(value: Any) -> Any:
    return json.loads(json.dumps(list(value) if isinstance(value, tuple) else value))


def test_every_widget_of_the_contract_has_a_class() -> None:
    assert sorted(CONCRETE) == sorted(n for n in aw.__all__ if n in CONCRETE)
    assert all(w["kind"].startswith("awf-") for w in CONCRETE.values())  # GEN-007


@pytest.mark.parametrize("title", sorted(CONCRETE))
def test_synced_traits_are_those_of_the_schema(title: str) -> None:
    cls = getattr(aw, title)
    synced = {k for k in cls.class_traits(sync=True) if k not in FRAMEWORK}
    assert synced == set(CONCRETE[title]["traits"])


@pytest.mark.parametrize("title", sorted(CONCRETE))
def test_class_defaults_are_the_schema_defaults(title: str) -> None:
    cls = getattr(aw, title)
    traits = cls.class_traits(sync=True)
    for name, spec in CONCRETE[title]["traits"].items():
        if name in {"_session", "_heartbeat"}:
            continue
        assert _json(traits[name].default()) == spec["default"], f"{title}.{name}"


@pytest.mark.parametrize("title", sorted(CONCRETE))
def test_a_new_widget_is_an_indicator_with_the_core_liveness(title: str) -> None:
    w = getattr(aw, title)()
    assert w.mode == "indicator"
    assert w._session  # announced by the core base class
