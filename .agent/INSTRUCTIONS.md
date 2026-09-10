# Working on this public portfolio

Private execution and security state is intentionally not committed.
Use a user-provided private handoff bundle when available. Otherwise reconstruct
state from actual Git, source, tests, and observed runtime behavior.
Actual source and Git always override prior memory.

Preserve the existing architecture, artwork, working features, and public content.
Keep raw logs, findings, private knowledge graphs, and handoff archives outside
this repository. Keep Graphify outputs private and exclude execution state from
extraction. Public portfolio facts belong in `data/*.ts`.

Run `npm run verify` before publishing. Use the checks in `docs/testing.md`.
Inspect staged files before each commit. Never discard unrelated local work.
Do not rewrite history without explicit user authorization.
