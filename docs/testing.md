# Testing

Run `npm run verify` before publishing. It checks the public file policy,
TypeScript, lint, behavioral tests, the production build, and HTTP responses
from the built Worker.

Use a browser to check navigation, focus, responsive layouts, scrolling in both
directions, reduced motion, and graphics fallbacks. Test the deployed version
after publishing; a successful local build does not establish production state.

Keep execution checkpoints, screenshots made for investigations, raw logs, and
security findings outside the repository. A private handoff can record which
checks passed and what remains blocked.

To enable the repository's staged-file check in a fresh clone:

```bash
git config core.hooksPath .githooks
```
