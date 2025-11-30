```markdown
<!-- agent-update:start:testing-strategy -->
# Testing Strategy

Document how quality is maintained across the codebase.

## Test Types
- **Unit**: Tests individual functions, components, or modules in isolation using Jest as the primary framework. Test files follow naming conventions like `*.test.js`, `*.test.ts`, or `*.spec.js` and are colocated alongside source files in the `src/` directory or within a `tests/` subdirectory. Mocking is handled via Jest's built-in features for dependencies like APIs or utilities.
- **Integration**: Focuses on testing interactions between multiple units, such as API endpoints with database mocks or component renders with state management (e.g., Redux or Context API). Utilizes Jest combined with libraries like `msw` for API mocking or `@testing-library/react` for component integration. Scenarios include validating data flow from services to UI components; no additional tooling beyond npm dependencies is required.
- **End-to-end**: Covers user workflows across the full application stack, such as form submissions or navigation flows. Currently, no dedicated E2E harness like Cypress is implemented; basic E2E validation occurs via integration tests simulating browser-like behavior with Jest and jsdom. Future sprints (e.g., sprint3) may introduce Playwright for full browser automation in the `public/` and `src/` environments.

## Running Tests
- Execute all tests with `npm run test`.
- Use watch mode locally: `npm run test -- --watch`.
- Add coverage runs before releases: `npm run test -- --coverage`.

## Quality Gates
- Minimum code coverage threshold: 80% for both statements and branches, enforced via Jest's `--coverage` reporter and checked in CI pipelines.
- Linting requirements: ESLint must pass with the project's configuration (e.g., Airbnb style guide or custom rules in `.eslintrc.js`), including no unused variables or prop-type errors. Prettier formatting is required before merging, run via `npm run lint` and `npm run format`.
- Additional checks: TypeScript compilation (`tsc --noEmit`) and security scans (if integrated via `npm audit`) must succeed in pull requests.

## Troubleshooting
- **Flaky suites**: No known flaky tests currently; monitor integration tests involving async API mocks, which may fail intermittently due to timing issues in jsdom. If encountered, rerun with `--runInBand` to isolate.
- **Long-running tests**: Unit tests for sprint2/sprint3 features (e.g., in `src/` components) may take >5s if mocking large datasets; optimize by reducing mock complexity.
- **Environment quirks**: Ensure Node.js >=16 and consistent dependency versions across local and CI (e.g., GitHub Actions). Common issues include missing `jsdom` polyfills for DOM APIs—resolved by updating Jest config in `package.json`. Link to open issues: [Issue #45 - Intermittent test failures in sprint3](https://github.com/repo/issues/45) for ongoing tracking.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Review test scripts and CI workflows to confirm command accuracy.
2. Update Quality Gates with current thresholds (coverage %, lint rules, required checks).
3. Document new test categories or suites introduced since the last update.
4. Record known flaky areas and link to open issues for visibility.
5. Confirm troubleshooting steps remain valid with current tooling.

<!-- agent-readonly:sources -->
## Acceptable Sources
- `package.json` scripts and testing configuration files.
- CI job definitions (GitHub Actions, CircleCI, etc.).
- Issue tracker items labelled “testing” or “flaky” with maintainer confirmation.

<!-- agent-update:end -->
```
