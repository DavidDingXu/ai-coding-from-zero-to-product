#!/usr/bin/env node

import { buildInstallReport, formatTextReport } from "./install-checker.js";

const json = process.argv.includes("--json");

try {
  const report = await buildInstallReport();
  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    process.stdout.write(formatTextReport(report));
  }
  process.exit(report.ok ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
