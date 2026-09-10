# Resume procedure

**ACTUAL REPOSITORY + GIT STATE OVERRIDES ALL MEMORY.**

**GRAPHIFY IS FOR CODE/ARCHITECTURE DISCOVERY. STATE.md IS FOR EXECUTION PROGRESS.**

1. Read `STATE.md`, then `DECISIONS.md`; read only relevant parts of `KNOWLEDGE.yaml`.
2. Verify repository root, branch, status (staged/unstaged/untracked), local HEAD, origin and remote HEAD, and ahead/behind state. Uncommitted does not mean unfinished. Never discard changes to recover a session.
3. Check `command -v graphify` and `graphify --version`. If absent, use the official `uv tool install graphifyy` (or pipx). Do not reinstall a working CLI.
4. Check the saved graph and source freshness. Reuse `graphify-out/graph.json`; run `graphify update .` only when stale. For CLI 0.9.56, build once with `graphify extract . --code-only --max-workers 2` if absent (`/graphify .` is assistant syntax). Use local deterministic code extraction; curated facts/docs remain in .agent. If the tool is not on PATH, resolve its executable using `uv tool dir --bin`.
5. Query Graphify before broad exploration: `graphify query "pigment engine"`, `graphify explain "LabExplorer"`, or `graphify path "app/page.tsx" "HardwareScene()"`. Use the result to open only relevant source files. Code wins if the graph is wrong.
6. Continue the exact next action in STATE. Verify implemented work before changing it. Never recreate completed sections, assets or research, or replace working code for stylistic preference.
7. Update STATE after meaningful milestones and before long builds/browser checks. Include exact next action, HEAD, graph freshness, tests, issues, commit and push status.
8. Update DECISIONS only for durable design/architecture choices. Update KNOWLEDGE only for public portfolio facts and their relationships. Temporary bugs belong in STATE.
9. Keep Graphify synchronized at substantial milestones and after pulls/merges/branch switches. Check `graphify hook status`; install hooks only if absent. New clones must install local hooks. If the environment ends a detached hook before it finishes, run `PYTHONHASHSEED=0 GRAPHIFY_MAX_WORKERS=2 graphify update .` in the foreground and verify completion.
10. Use the actual package scripts. `npm run verify` runs typecheck, lint, tests, build and production HTTP checks. Do not rerun completed expensive QA without a concrete remaining risk.
11. Before final commit, review the diff and graph for private information, accidental generated files and secrets. Persist graph.json, GRAPH_REPORT.md and graph.html; ignore local caches/costs. Do not force-push or rewrite history.
12. Verify the remote commit and local/remote alignment. If the post-commit graph produces useful changes, inspect and make one minimal follow-up commit, not an endless update/commit loop.
13. Before stopping, leave an exact checkpoint in STATE. A commit cannot record its own SHA: identify the pending checkpoint commit by message, then verify actual HEAD on resume.

Do not commit uploaded briefs, private network addresses, customer records, company incidents, credentials, salary or family information. Do not copy unrelated conversation memory into this repository.
