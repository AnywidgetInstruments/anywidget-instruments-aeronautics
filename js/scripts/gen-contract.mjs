// Trait contract generator (HOST-001). The JSON Schemas in
// src/anywidget_instruments_aeronautics/schema/ are the single source of truth;
// they extend the base schema of the anywidget-instruments core by its $id. The
// generator of the core (js/scripts/contract.mjs) flattens them into:
//
//   js/src/generated/contract.ts                                TypeScript trait interfaces and runtime specs
//   src/anywidget_instruments_aeronautics/static/contract.json description for host authors (shipped in the wheel)
//
// Every output is generated and never committed.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContract as build, pythonVersion, renderJson, renderTs, writeOutputs } from "anywidget-instruments/js/scripts/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SCHEMA_DIR = join(ROOT, "src/anywidget_instruments_aeronautics/schema");
const TS_OUT = join(ROOT, "js/src/generated/contract.ts");
const JSON_OUT = join(ROOT, "src/anywidget_instruments_aeronautics/static/contract.json");

export function buildContract() {
  return build({ dir: SCHEMA_DIR, kindPrefix: "awf-" });
}

export function generate({ write = true } = {}) {
  const contract = buildContract();
  const ts = renderTs(contract, { source: "src/anywidget_instruments_aeronautics/schema/" });
  const json = renderJson(contract, {
    comment: "Trait contract of anywidget-instruments-aeronautics, generated from the JSON Schemas in schema/, which extend the base schema of anywidget-instruments.",
    version: pythonVersion(ROOT),
  });
  if (write) writeOutputs({ [TS_OUT]: ts, [JSON_OUT]: json });
  return { contract, ts, json };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { contract } = generate();
  const n = Object.values(contract.widgets).filter((w) => !w.abstract).length;
  console.log(`contract: ${Object.keys(contract.widgets).length} schemas (${n} widgets)`);
}
