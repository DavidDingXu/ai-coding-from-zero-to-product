import { runQwenSmokeTest } from "./smoke-runner.js";

const dryRun = process.argv.includes("--dry-run");

try {
  const result = await runQwenSmokeTest({ dryRun });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
