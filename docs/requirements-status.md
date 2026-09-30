# Requirements status

Legend: ✅ implemented and tested · 🟡 partial · ⬜ not started.

| Requirement | Status | Where |
|---|---|---|
| GEN-001 | ✅ | Front end on the anywidget-instruments core only (`package.json`) |
| GEN-002 | ✅ | One ES module and one stylesheet (`js/build.mjs`) |
| GEN-003 | ✅ | Conversion, rounding, arcs and states in the front end (`js/src/core/`) |
| GEN-004 | ✅ | No network resource: the bundle carries the core |
| GEN-005 | ✅ | `LICENSE` |
| GEN-006 | ✅ | Python binding depending on the core (`pyproject.toml`); CPython 3.10 and later in CI |
| GEN-007 | ✅ | Every `_kind` starts with `awf-` (contract generator, `tests/test_contract.py`) |
| API-001 .. API-003 | ✅ | `js/src/core/view.ts`; `js/test/widgets.test.ts` |
| API-004 | ✅ | Night theme (`js/test/widgets.test.ts`) |
| FLT-001 .. FLT-006, FLT-011 .. FLT-016 | ✅ | The basic six (`js/src/widgets/`, `js/test/widgets.test.ts`) |
| FLT-007 .. FLT-010 | ⬜ | HSI, primary flight display, instrument panel, engine gauges |
| UNIT-001 .. UNIT-003 | ✅ | `js/src/core/units.ts`; `js/test/units.test.ts` |
| ROB-001 .. ROB-003 | ✅ | `js/src/core/state.ts`; `js/test/widgets.test.ts` |
| ROB-004 | ✅ | Stale indication of the core |
| A11Y-001 | ✅ | Values as text in the `aria-label` of each widget |
| A11Y-002 | ✅ | States in text (`NO VALUE`, `STALE`, `INVALID`) as well as colour |
| A11Y-003 | ✅ | No animation of pointers or cards |
| DOC-001 | ✅ | Safety notice on the home page, the catalog and the README |
| DOC-002 | ✅ | [Standards and references](standards.md) |
| DOC-003 | ✅ | `npm run images`, pictures in the [catalog](widgets.md) |
