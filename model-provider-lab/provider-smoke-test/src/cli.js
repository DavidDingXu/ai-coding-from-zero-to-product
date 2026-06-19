#!/usr/bin/env node

import { listProviderCompatibility } from "./provider-config.js";
import { runSmokeTest } from "./smoke-runner.js";

const provider = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
const matrix = process.argv.includes("--matrix");

if (matrix) {
  console.log(JSON.stringify(listProviderCompatibility(), null, 2));
  process.exit(0);
}

if (!provider || provider === "-h" || provider === "--help") {
  printHelp();
  process.exit(provider ? 0 : 1);
}

try {
  const result = await runSmokeTest({ provider, dryRun });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function printHelp() {
  console.log(`Usage:
  node src/cli.js --matrix
  node src/cli.js deepseek [--dry-run]
  node src/cli.js qwen [--dry-run]

Examples:
  npm run matrix
  npm run dry-run:deepseek
  npm run dry-run:qwen
  npm run smoke:deepseek
  npm run smoke:qwen`);
}
