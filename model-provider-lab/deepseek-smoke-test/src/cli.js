import { runDeepSeekSmokeTest } from "./smoke-runner.js";

const dryRun = process.argv.includes("--dry-run");

try {
  const result = await runDeepSeekSmokeTest({ dryRun });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
