// node build.mjs — re-embed kinetic-enterprise.css in kinetic-enterprise.tsx.
// The CSS is the source of truth; the TSX carries it as KINETIC_CSS so
// <KineticStyles /> works from one file. No dependencies.
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync(new URL("./kinetic-enterprise.css", import.meta.url), "utf8");
const tsxUrl = new URL("./kinetic-enterprise.tsx", import.meta.url);
const tsx = readFileSync(tsxUrl, "utf8");
const marker = "const KINETIC_CSS = ";
const at = tsx.indexOf(marker);
if (at < 0) throw new Error(`${marker.trim()} not found in kinetic-enterprise.tsx`);
const next = tsx.slice(0, at) + marker + JSON.stringify(css) + ";\n";
if (next === tsx) console.log("kinetic-enterprise.tsx already up to date");
else { writeFileSync(tsxUrl, next); console.log(`kinetic-enterprise.tsx updated (${css.length} chars of CSS)`); }
