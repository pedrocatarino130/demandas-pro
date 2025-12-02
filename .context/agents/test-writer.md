<!-- agent-update:start:agent-test-writer -->
# Test Writer Agent Playbook

## Mission
The Test Writer Agent supports the development team by authoring, maintaining, and optimizing tests to validate application functionality, prevent regressions, and uphold code quality standards. This agent ensures that every new feature, refactoring, or bug fix is accompanied by robust tests, contributing to a reliable CI/CD pipeline and reducing production incidents. Engage the Test Writer Agent during sprint planning for new implementations, after code changes in PRs, when addressing flaky tests, or to improve overall test coverage metrics. It is particularly useful in this repository for unit tests in `tests/`, integration tests involving `src/`, and end-to-end tests leveraging Playwright, as evidenced by the `playwright-report` and `test-results` directories.

## Responsibilities
- Write comprehensive unit and integration tests using frameworks like Jest or Vitest for components in `src/`
- Author end-to-end (E2E) tests with Playwright to simulate user interactions across `public/` assets and application flows
- Ensure good test coverage across the codebase, targeting critical paths in `sprint2/` and `sprint3/` deliverables
- Create test utilities, fixtures, and mocks in `tests/` to support reusable testing patterns
- Maintain and update existing tests, including refactoring for non-determinism and aligning with evolving architecture
- Generate test reports and analyze `test-results/` outputs to identify coverage gaps or failures
- Collaborate on test strategy by reviewing PRs and suggesting test enhancements for security, data flow, and integrations

## Best Practices
- Write tests that are clear, maintainable, and independent, following AAA (Arrange, Act, Assert) structure
- Test both happy paths and edge cases, including error handling, network failures, and invalid inputs
- Use descriptive test names that describe behavior, e.g., "should render login form with invalid credentials"
- Prioritize mocking external dependencies (e.g., APIs in `data-flow.md`) to avoid flakiness
- Leverage Playwright for E2E tests on real browser environments, capturing screenshots and videos in `playwright-report`
- Run tests locally with `npm test` or `npx playwright test` before committing, and aim for fast execution times
- Integrate tests with CI workflows from `scripts/` to automate coverage reporting and failure notifications
- Refactor tests alongside code changes to keep them synchronized with `src/` updates

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `SAVES/` — Stores saved states, backups, or archived configurations from development sprints.
- `docs/` — Contains project documentation, including guides, architecture notes, and contributor resources.
- `playwright-report/` — Holds generated reports, traces, screenshots, and videos from Playwright E2E test runs.
- `public/` — Holds static assets such as images, CSS, JavaScript files, and other publicly accessible resources for the frontend.
- `scripts/` — Contains automation scripts, build utilities, deployment helpers, and testing setup commands.
- `sprint2/` — Includes code, deliverables, and artifacts developed during Sprint 2 of the project.
- `sprint3/` — Includes code, deliverables, and artifacts developed during Sprint 3 of the project.
- `src/` — Main source code directory, containing core application logic, components, and modules.
- `test-results/` — Stores outputs from various test executions, including logs, coverage reports, and failure artifacts.
- `tests/` — Dedicated directory for all test files, including unit tests, integration tests, E2E tests, and test utilities.

## Documentation Touchpoints
- [Documentation Index](../docs/README.md) — agent-update:docs-index
- [Project Overview](../docs/project-overview.md) — agent-update:project-overview
- [Architecture Notes](../docs/architecture.md) — agent-update:architecture-notes
- [Development Workflow](../docs/development-workflow.md) — agent-update:development-workflow
- [Testing Strategy](../docs/testing-strategy.md) — agent-update:testing-strategy
- [Glossary & Domain Concepts](../docs/glossary.md) — agent-update:glossary
- [Data Flow & Integrations](../docs/data-flow.md) — agent-update:data-flow
- [Security & Compliance Notes](../docs/security.md) — agent-update:security
- [Tooling & Productivity Guide](../docs/tooling.md) — agent-update:tooling

<!-- agent-readonly:guidance -->
## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count, improved test coverage, decreased technical debt
- **Velocity:** Time to complete typical tasks, deployment frequency
- **Documentation:** Coverage of features, accuracy of guides, usage by team
- **Collaboration:** PR review turnaround time, feedback quality, knowledge sharing

**Target Metrics:**
- Achieve at least 80% code coverage for new features and maintain overall coverage above 70%.
- Ensure 100% of pull requests include corresponding tests before merge.
- Track trends over time to identify improvement areas, such as flaky test reduction by monitoring failure rates quarterly.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: [Common Problem]
**Symptoms:** Describe what indicates this problem
**Root Cause:** Why this happens
**Resolution:** Step-by-step fix
**Prevention:** How to avoid in the future

**Example:**
### Issue: Build Failures Due to Outdated Dependencies
**Symptoms:** Tests fail with module resolution errors
**Root Cause:** Package versions incompatible with codebase
**Resolution:**
1. Review package.json for version ranges
2. Run `npm update` to get compatible versions
3. Test locally before committing
**Prevention:** Keep dependencies updated regularly, use lockfiles

### Issue: Flaky Tests in Integration Suite
**Symptoms:** Tests pass intermittently, causing unreliable CI/CD pipelines
**Root Cause:** Non-deterministic external dependencies or race conditions in async code
**Resolution:**
1. Isolate the failing test and run it repeatedly locally
2. Mock external services using tools like MSW or nock
3. Add retries or fixed seeds for random elements
4. Refactor to eliminate race conditions with proper awaits
**Prevention:** Prioritize mocking in integration tests and review async patterns during code reviews

### Issue: Low Test Coverage in E2E Scenarios
**Symptoms:** Playwright reports show uncovered user flows in `playwright-report/`
**Root Cause:** Focus on unit tests neglecting browser-based interactions
**Resolution:**
1. Identify gaps via coverage tools like `npx playwright test --coverage`
2. Add new E2E tests for key paths in `sprint3/` features
3. Use page object models in `tests/` for maintainable selectors
4. Integrate with CI scripts from `scripts/` for automated reporting
**Prevention:** Include E2E test planning in sprint kickoffs and review coverage in PRs

## Hand-off Notes
After completing test authoring or updates, summarize the following in PR descriptions or hand-off docs:
- Tests added/updated: List files and coverage impact (e.g., +5% coverage from new E2E suite).
- Remaining risks: Potential flakiness sources or untested edge cases (e.g., "Mobile viewport not fully covered").
- Suggested follow-ups: Actions like "Run full suite in CI" or "Review mocks for API changes in data-flow.md".
- Evidence: Link to commits (e.g., #123 for refactoring) and metrics (e.g., coverage report from `test-results/`).

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
