```yaml
---
ai_update_goal: Ensure the tooling guide reflects the current repository setup, including Node.js version, dependencies, scripts, and environment configurations. Update any outdated commands, add references to new directories like scripts/ if relevant, and verify cross-links to other docs.
required_inputs:
  - Latest package.json to confirm dependencies and scripts.
  - playwright.config.js for test configurations.
  - .github/workflows/deploy.yml for CI/CD details.
  - Repository directory structure to identify any new tools or folders.
success_criteria:
  - All commands are verified and executable in the current repo state.
  - Language is consistent (English), formatting is clean Markdown.
  - No placeholders or TODOs remain; env vars match Firebase integration.
  - Cross-references to deployment and testing docs if applicable.
---
```

<!-- agent-update:start:tooling -->
# Tooling & Productivity Guide

## Required Tooling
- **Node.js 18+ and npm**: Install via [nodejs.org](https://nodejs.org) or [nvm](https://github.com/nvm-sh/nvm). Required for running `npm run dev`, `npm run build`, and `npm run test`.
- **Git**: Use the branching flow `git switch -c feature/...` for new branches, create PRs, and merge to `main`.
- **Playwright**: Listed in `devDependencies`; run `npx playwright install` if the runner requests additional browsers.
- **Editor**: VS Code with extensions for ESLint, Prettier, and `.env` file support is recommended.

## Automation & Scripts
- `npm run dev`: Starts the Vite dev server with Hot Module Replacement (HMR) at `http://localhost:3000`. See [src/](src/) for application source.
- `npm run build`: Generates the production build in `dist/`. For GitHub Pages simulation, set `BASE_URL=/<repo-name>/`. For quick local PWA testing, use `npx serve dist`.
- `npm run test:e2e`: Executes the Playwright end-to-end test suite. The `playwright.config.js` automatically starts `npm run dev`; to validate the Service Worker (SW) in development mode, inject `window.__ENABLE_SW_IN_DEV__` via `page.addInitScript`.
- `npm run lint` and `npm run format`: Run these before opening PRs to avoid noise. Prettier and ESLint are configured in the root.

Additional scripts may be found in the `scripts/` directory for custom automation tasks.

## Useful Aliases / Tips
- Add an alias like `alias nb='BASE_URL=/<repo-name>/ npm run build'` to simulate GitHub Pages builds quickly.
- Use `npx playwright test --project=chromium --headed` to debug specific scenarios without running all browsers. Reports are generated in `playwright-report/` and `test-results/`.
- The deployment workflow supports `workflow_dispatch`. Trigger it via the GitHub Actions tab to validate `.github/workflows/deploy.yml` without merging. See the [Deployment Guide](deployment.md) for more details.

## Environment Variables
- Create a `.env.local` file (gitignored) with the following Firebase configuration values:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- In GitHub, add Repository Secrets with the same names to populate `.github/workflows/deploy.yml` during CI/CD.
- To force-enable the Service Worker in development for testing, inject `window.__ENABLE_SW_IN_DEV__ = true` before the app boots (e.g., in tests or via browser console).
<!-- agent-update:end -->
