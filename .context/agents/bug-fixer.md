<!-- agent-update:start:agent-bug-fixer -->
# Bug Fixer Agent Playbook

## Mission
The Bug Fixer Agent supports the development team by efficiently identifying, diagnosing, and resolving bugs in the codebase to maintain code quality and reliability. Engage it when a bug report is filed via issues, an error occurs during development, testing, or in production, or when code reviews uncover potential issues requiring fixes.

## Responsibilities
- Analyze bug reports and error messages
- Identify root causes of issues
- Implement targeted fixes with minimal side effects
- Test fixes thoroughly before deployment

## Best Practices
- Reproduce the bug before fixing
- Write tests to prevent regression
- Document the fix for future reference

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `docs/` — Contains project documentation, including guides, API references, and setup instructions.
- `SAVES/` — Stores saved snapshots, backups, or intermediate files from development sprints.
- `playwright-report/` — Holds reports generated from Playwright end-to-end testing runs.
- `public/` — Holds static assets such as images, fonts, and index.html for the web application.
- `scripts/` — Contains utility scripts for tasks like building, linting, or deployment automation.
- `sprint2/` — Contains code and features developed during Sprint 2 of the project.
- `sprint3/` — Contains code and features developed during Sprint 3 of the project.
- `src/` — The main source code directory, including components, utilities, and application logic.
- `test-results/` — Stores outputs and results from automated test executions.
- `tests/` — Directory for unit tests, integration tests, and other testing files.

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
- Reduce bug resolution time by 30% compared to previous average
- Achieve 100% test coverage for fixed bugs
- Track trends over time to identify improvement areas, such as recurring bug types, and adjust prevention strategies accordingly

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Build Failures Due to Outdated Dependencies
**Symptoms:** Tests fail with module resolution errors
**Root Cause:** Package versions incompatible with codebase
**Resolution:**
1. Review package.json for version ranges
2. Run `npm update` to get compatible versions
3. Test locally before committing
**Prevention:** Keep dependencies updated regularly, use lockfiles

### Issue: Runtime Errors in src/ Components
**Symptoms:** Application crashes or unexpected behavior in the browser console during user interactions
**Root Cause:** Logic errors, unhandled exceptions, or state management issues in React-like components
**Resolution:**
1. Reproduce the error using provided steps or browser dev tools
2. Use debugging tools like React DevTools or console logs to trace the issue
3. Implement the fix, add error boundaries if applicable, and write a regression test
4. Verify across browsers if UI-related
**Prevention:** Adopt consistent error handling patterns, conduct code reviews for state logic, and run linting tools regularly

### Issue: Failing Playwright End-to-End Tests
**Symptoms:** Automated tests in playwright-report/ show failures related to UI interactions or page loads
**Root Cause:** Changes in DOM structure, network delays, or environment inconsistencies between local and CI setups
**Resolution:**
1. Run `npx playwright test` locally to reproduce
2. Inspect screenshots and traces in playwright-report/ for visual diffs
3. Update selectors or add waits in test scripts if needed, then fix underlying component issues
4. Rerun tests and commit changes with updated baselines if applicable
**Prevention:** Use robust selectors (e.g., data-testid), run tests in CI early, and review test flakiness metrics regularly

## Hand-off Notes
After completing a bug fix, summarize the following in the pull request or issue comments:
- Key outcomes: Bug resolved, tests passed, no regressions introduced
- Remaining risks: Potential impacts on related features (e.g., performance in sprint3/)
- Suggested follow-ups: Monitor in staging environment, update user-facing docs if affected, or schedule a retrospective if part of a pattern

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
