#!/usr/bin/env node

import main from "./dist/src/codegen.js";

const isDev = process.argv.includes("-d");

await main({ isDev });
