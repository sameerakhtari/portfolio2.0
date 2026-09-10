import { execFileSync } from "node:child_process";

const staged = process.argv.includes("--staged");
const args = staged
  ? ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]
  : ["ls-files", "-z"];
const paths = execFileSync("git", args, { encoding: "utf8" }).split("\0").filter(Boolean);
const privatePath = /(?:^|\/)(?:\.agent-private|graphify-out|work\/(?:security|logs))(?:\/|$)|(?:^|\/)\.agent\/(?!INSTRUCTIONS\.md$|DECISIONS\.md$)|private-handoff|private-backup|(?:^|\/)(?:STATE|JOURNAL|TASKS|SECURITY_FINDINGS|MEMORY_GRAPH|TEST_MATRIX|PRIVATE_KNOWLEDGE|SESSION_MANIFEST)\.(?:md|ya?ml|json)$|(?:^|\/)\.env(?:\.|$)|\.(?:bundle|pem|key|sql)$/i;
const blocked = paths.filter((file) => privatePath.test(file));
if (blocked.length) {
  console.error("Keep private execution data and credentials outside the public repository:");
  console.error(blocked.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Public file policy passed (${paths.length} ${staged ? "staged" : "tracked"} paths).`);
}
