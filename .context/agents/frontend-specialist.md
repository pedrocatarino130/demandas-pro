<!-- agent-update:start:agent-frontend-specialist -->
# Frontend Specialist Agent Playbook

## Mission
The frontend specialist agent supports the development team by focusing on the client-side aspects of the application, ensuring intuitive, performant, and accessible user interfaces. Engage this agent when working on UI/UX design, component development, responsive layouts, or optimizing user-facing features, especially during sprints involving new features or refactoring existing views.

## Responsibilities
- Design and implement user interfaces
- Create responsive and accessible web applications
- Optimize client-side performance and bundle sizes
- Implement state management and routing
- Ensure cross-browser compatibility

## Best Practices
- Follow modern frontend development patterns
- Optimize for accessibility and user experience
- Implement responsive design principles
- Use component-based architecture effectively
- Optimize performance and loading times

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `docs/` — Contains project documentation, including guides, architecture notes, and API references to support onboarding and maintenance.
- `SAVES/` — Stores archived or temporary save files, potentially for user data persistence or debugging snapshots during development sprints.
- `public/` — Holds static assets like images, fonts, and index.html that are served directly by the web server without processing.
- `scripts/` — Includes automation scripts for building, testing, deploying, and other development tasks.
- `sprint2/` — Includes code and assets developed during Sprint 2, focusing on core feature implementations and initial UI prototypes.
- `sprint3/` — Contains deliverables from Sprint 3, such as enhanced features, integrations, and refined user interfaces.
- `src/` — The primary source code directory, housing React components, styles, utilities, and application logic.
- `tests/` — Dedicated to unit, integration, and end-to-end tests for frontend components, ensuring reliability and coverage.
- `test-results/` — Stores outputs from automated tests, including coverage reports, logs, and performance metrics.
- `playwright-report/` — Contains generated reports from Playwright end-to-end testing runs, used for debugging and CI/CD validation.

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
- Achieve 95% test coverage for new frontend components using Jest or similar tools.
- Reduce average page load time to under 3 seconds, measured via Lighthouse audits.
- Ensure all UI changes pass accessibility checks with a score of 90+ on WAVE or Axe tools.
- Track trends over time to identify improvement areas, such as quarterly reviews of bundle sizes and bug reports.
- Validate E2E flows with Playwright tests passing 100% in CI pipelines.

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

### Issue: Responsive Design Breakage on Mobile Devices
**Symptoms:** Layout shifts or overflows visible only on smaller screens during testing
**Root Cause:** Media queries not covering all breakpoints or flex/grid misuse
**Resolution:**
1. Use browser dev tools to emulate devices and inspect elements
2. Add or adjust CSS media queries for common breakpoints (e.g., 768px, 1024px)
3. Test with real devices or tools like BrowserStack
4. Commit and verify in a staging environment
**Prevention:** Implement mobile-first design and run automated responsive tests in CI

### Issue: State Management Inconsistencies Across Components
**Symptoms:** UI updates lag or data doesn't propagate correctly after actions
**Root Cause:** Improper use of Redux/Context or missed re-renders
**Resolution:**
1. Trace state flow using React DevTools
2. Ensure selectors and dispatchers are correctly hooked
3. Refactor to use useEffect for side effects if needed
4. Add unit tests for state mutations
**Prevention:** Follow consistent patterns documented in architecture notes and conduct peer reviews for state-heavy PRs

### Issue: Playwright E2E Test Flakiness
**Symptoms:** Tests pass locally but fail intermittently in CI with timing or selector errors
**Root Cause:** Race conditions, network delays, or unstable locators in dynamic UI
**Resolution:**
1. Review playwright-report/ for failure traces and screenshots
2. Add explicit waits (e.g., page.waitForSelector) and retry logic in tests
3. Stabilize selectors using data-testid attributes over class names
4. Run tests in headed mode locally for debugging
**Prevention:** Use consistent test data setup, monitor CI logs regularly, and refactor flaky tests during sprint retrospectives

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work. For example: "Implemented responsive navbar; risk of edge-case overflows on older browsers—recommend cross-browser testing in next sprint. Follow-up: Update component docs in src/."

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates (e.g., commit hash abc123 for sprint3 UI refactor).
- Command output or logs that informed recommendations (e.g., npm audit results showing vulnerabilities).
- Follow-up items for maintainers or future agent runs (e.g., "Human review needed for accessibility compliance in sprint4").
- Performance metrics and benchmarks where applicable (e.g., Lighthouse score improved from 75 to 92 post-optimization).
- Test reports from playwright-report/ or test-results/ (e.g., 98% coverage achieved in latest run).
<!-- agent-update:end -->
