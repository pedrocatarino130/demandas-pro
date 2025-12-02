<!-- agent-update:start:development-workflow -->
# Development Workflow

## Branching & Releases
- We work directly on `main`. Each PR requires human review (or by the maintainer themselves) and, after merge, the `Deploy to GitHub Pages` workflow automatically publishes the build to `https://<user>.github.io/<repo>/`.
- The workflow uses `BASE_URL=/${{ github.event.repository.name }}/` and `actions/deploy-pages`. There is no `gh-pages` branch; the Action generates the artifact at deploy time.
- Formal releases do not use tags or automatic versioning. Update `README.md` and relevant docs whenever deploy behavior changes. Recent sprints (sprint2, sprint3) have introduced new directories for ongoing development, but core branching remains unchanged.

## Local Development Loop
1. Install dependencies: `npm install` (Node 18+).
2. Run `npm run dev` to start Vite at `http://localhost:3000`.
3. Configure a `.env.local` file when needing Firebase (all `VITE_FIREBASE_*` vars). Without it, the app runs offline only.
4. To reproduce the GitHub Pages scenario locally, generate the build with custom base: `BASE_URL=/demandas/ npm run build && npx serve dist`. Adjust `/demandas/` to match your repo name if testing a different setup.
5. When preparing a PR, run:
   - `npm run build` (with or without `BASE_URL` for testing) to ensure `dist/` compiles.
   - `npm run test:e2e` (Playwright) using default `BASE_URL` (`http://localhost:3000`). The SW is disabled in dev; use `page.addInitScript(() => window.__ENABLE_SW_IN_DEV__ = true)` if needing to test registration. Recent test-results directories confirm E2E coverage for chromium, firefox, and webkit projects.

## Code Review Expectations
- Commits must follow Conventional Commits (`chore(plan): ...`, `feat(routes): ...`).
- Ensure new features update `README.md` and docs in `docs/`.
- Before merge: `npm run build` + `npm run test:e2e`. If changing deploy/infra, attach screenshots of the Action or relevant logs.
- Never commit secrets. Use `.env.local` locally and GitHub Secrets (`VITE_FIREBASE_*`) for the workflow. Repository includes test-results and playwright-report for CI evidence.

## Onboarding Checklist
1. Read `README.md` (GitHub Pages Deploy section) and `docs/tooling.md` for quick commands. Note: Documentation has migrated from `.context/docs/` to `docs/`.
2. Set up `.env.local` with Firebase placeholders (or default to offline mode).
3. Run `npm run dev` and navigate `/projetos`, `/estudos`, `/rotina` to validate the environment. Sprint directories (sprint2, sprint3) contain experimental features; integrate as needed.
4. Run `npm run test:e2e -- --project=chromium` to ensure Playwright launches the local dev server.
5. Before touching deploy, review `.github/workflows/deploy.yml` and confirm secrets exist in Settings > Secrets > Actions.
<!-- agent-update:end -->
