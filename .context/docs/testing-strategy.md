```markdown
<!-- agent-update:start:testing-strategy -->
# Testing Strategy

## Test Types
- **E2E (Playwright)**: Official suite located in `tests/e2e/`. Covers SPA navigation, quick add, persistence, and (now) refresh in deep routes/SW registration.
- **Manual Smoke**: After each build intended for Pages, validate `/`, `/projetos`, `/estudos`, and `/rotina` in a real browser to confirm that the `BASE_URL` was applied correctly. Also check console logs to ensure the SW registered without 404 errors.
- (There are no formal unit/integration tests at the moment; the focus remains on E2E + manual smoke. See [architecture-decisions.md](architecture-decisions.md#test-coverage) for plans to introduce unit tests in future sprints.)

## Running Tests
- Run all E2E: `npm run test:e2e` (Playwright automatically starts `npm run dev`).
- Specific browser: `npx playwright test tests/e2e/navigation.spec.js --project=chromium`.
- UI mode: `npm run test:e2e:ui`.
- To validate the Service Worker during tests, inject `window.__ENABLE_SW_IN_DEV__ = true` via `page.addInitScript` (see examples in `tests/e2e/navigation.spec.js`).

## Quality Gates
- Build (`npm run build`) and Playwright must pass locally before opening a PR.
- When modifying deploy processes, attach logs/screenshots from the `Deploy to GitHub Pages` workflow to the PR description.
- If the SW or router undergo changes, perform manual smoke tests accessing `BASE_URL=/demandas/` (local build) and confirm direct refresh in routes (`/demandas/projetos`, etc.).
- Ensure no failures in `playwright-report` or `test-results` directories after local runs; these artifacts are generated for review.

## Troubleshooting
- **Playwright does not initialize**: Run `npx playwright install` and verify that port 3000 is free.
- **Tests involving SW hang**: Confirm that `window.__ENABLE_SW_IN_DEV__` is set before navigation (`page.addInitScript`). Clear previous registrations with `await navigator.serviceWorker.getRegistrations()` in tests.
- **Failures only in GitHub Pages**: Verify `BASE_URL` was exported correctly (check workflow logs) and ensure `public/404.html` is present in the published artifact. Cross-reference with [deployment-guide.md](deployment-guide.md#github-pages-setup) for BASE_URL configuration.
<!-- agent-update:end -->
```
