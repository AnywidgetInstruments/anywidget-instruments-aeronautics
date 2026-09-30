# AGENTS.md

Guidance for AI coding agents (and humans) working on this repository.

## Project

`anywidget-instruments-aeronautics`: flight instruments (airspeed, attitude, altimeter,
turn coordinator, heading, vertical speed, then HSI, primary flight display and engine
gauges) for computational notebooks, built on [anywidget](https://anywidget.dev) and on
the [anywidget-instruments](https://github.com/AnywidgetInstruments/anywidget-instruments)
core (base view, base class, trait contract and its generator, themes, liveness). It
depends on the core only, never on another widget library of the family.

The repository is at the **design stage**: `docs/specification.md` (EARS requirements)
comes before any code; `docs/requirements-status.md` tracks them. The layout to come is
that of anywidget-instruments-automotive: `js/` (TypeScript front end, one bundle, `_kind`
prefixed `awf-`), `src/anywidget_instruments_aeronautics/` (Python binding and
`schema/`, extending the base schema of the core by its `$id`), `tests/`, `e2e/`.

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
pip install "mkdocs>=1.6,<2" "mkdocs-material>=9.5"
mkdocs build --strict      # documentation site, from docs/
```

## Conventions

- Repository content is in English.
- Do not name, cite or compare with third-party products or projects whose ideas
  inspired a feature; describe the feature itself.
- Never commit generated files (`site/`, built bundles, generated contracts).

## Git

- Author and committer: the repository owner's identity (never an AI identity).
- No `Co-Authored-By` trailer for AI, no model or tool names in commit messages, code,
  comments or documentation.
- Commit messages: imperative subject ≤ 72 characters, blank line, body stating the
  problem, then the change; end with `Assisted-by: AI` when AI assisted.
