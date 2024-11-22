#!/usr/bin/env node

import main from "./dist/src/codegen.js";

const isDev = process.env.NODE_ENV === 'development';

await main({ isDev });
