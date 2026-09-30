// Front-end build (GEN-002). One ES module and one stylesheet, bundling the
// anywidget-instruments core the widgets derive from: a host loads them with no
// JavaScript toolchain and nothing from the network (GEN-004). Not minified,
// with its source map, so the module shipped in the wheel stays readable.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { generate } from "./scripts/gen-contract.mjs";

const OUT = "src/anywidget_instruments_aeronautics/static";

export const targets = [
  { entryPoints: ["js/src/index.ts"], outfile: `${OUT}/index.js`, bundle: true, format: "esm", minify: false, sourcemap: "linked", sourcesContent: true, legalComments: "inline", target: "es2020", charset: "utf8" },
  { entryPoints: ["js/src/styles.css"], outfile: `${OUT}/index.css`, bundle: true, minify: false, charset: "utf8" },
];

export async function buildAll({ write = true } = {}) {
  generate({ write });
  for (const t of targets) await build({ ...t, write, logLevel: write ? "info" : "silent" });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildAll();
}
