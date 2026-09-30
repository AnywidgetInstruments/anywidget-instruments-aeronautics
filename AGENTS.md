# AGENTS.md

Guidance for AI coding agents (and humans) working on this repository.

## Project

`anywidget-instruments-aeronautics`: flight instruments (airspeed, attitude, altimeter,
turn coordinator, heading, vertical speed, then HSI, primary flight display and engine
gauges) for computational notebooks, built on [anywidget](https://anywidget.dev) and on
the [anywidget-instruments](https://github.com/AnywidgetInstruments/anywidget-instruments)
core (base view, base class, trait contract and its generator, themes, liveness). It
depends on the core only, never on another widget library of the family.

The requirements come from `docs/specification.md` (EARS); `docs/requirements-status.md`
tracks them. The basic six instruments are implemented; the HSI, the primary flight
display, the instrument panel and the engine gauges are to come.

## Layout

| Path | Content |
|---|---|
| `src/anywidget_instruments_aeronautics/schema/` | Trait contract: one JSON Schema per widget, extending the base schema of the core by its `$id` |
| `src/anywidget_instruments_aeronautics/` | Python binding: `AeronauticsWidget` (`_base.py`) and the widgets (`_widgets.py`) |
| `src/anywidget_instruments_aeronautics/static/` | Built front end and `contract.json`: generated, never committed |
| `js/src/core/` | `view.ts` (base view, deriving from that of the core), `state.ts` (missing, stale and invalid values), `units.ts` |
| `js/src/widgets/` | One view per widget; `dial.ts` holds the drawing helpers of the round instruments |
| `js/src/generated/` | `contract.ts`, generated from the schemas by `npm run gen`: never committed |
| `js/preview/index.html` | The widgets with no kernel; `npm run images` captures them into `docs/img/widgets/` |
| `js/test/`, `tests/` | vitest (a host with no kernel), pytest (the classes against the contract) |

## Rules

- A change of behaviour goes through `docs/specification.md` first (bump its version and
  its revision history).
- Anything a widget displays — unit conversion, rounding, arcs, stale and missing
  states — is computed in the TypeScript front end, never in a host binding.
- Every widget is an indicator. Nothing is meant to be operated in flight.
- Anything general enough to serve another instrument family belongs in the core.
- Conventions come from the documents in `docs/standards.md`. The library claims no
  conformity with them; do not write "compliant with" in code, docs or commits. Quote
  figures from a standard only after checking them against the official text.
- Keep the safety notice (`docs/safety.md`) true: a change that affects what the widgets
  can be trusted with updates it in the same change.

## Commands

```bash
npm install && npm run build        # contract + bundle (the core comes from package.json)
npm run lint && npm run typecheck && npm test
npm run images                      # docs/img/widgets/<widget>-light.png and -dark.png
pip install "anywidget-instruments @ git+https://github.com/AnywidgetInstruments/anywidget-instruments@<commit of package.json>"
pip install -e ".[dev,docs]" && pytest && ruff check . && ruff format --check . && mypy src
mkdocs build --strict               # documentation site, from docs/
```

Take the images again whenever a widget changes, so the site never shows an older look.

## Conventions

- Repository content is in English.
- Do not name, cite or compare with third-party products or projects whose ideas
  inspired a feature; describe the feature itself.
- Never commit generated files (`site/`, `js/src/generated/`, `src/anywidget_instruments_aeronautics/static/`).

## Git

- Author and committer: the repository owner's identity (never an AI identity).
- No `Co-Authored-By` trailer for AI, no model or tool names in commit messages, code,
  comments or documentation.
- Commit messages: imperative subject ≤ 72 characters, blank line, body stating the
  problem, then the change; end with `Assisted-by: AI` when AI assisted.
