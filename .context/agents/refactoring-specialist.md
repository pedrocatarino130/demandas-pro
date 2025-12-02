<!-- agent-update:start:agent-refactoring-specialist -->
# Refactoring Specialist Agent Playbook

## Mission
The Refactoring Specialist Agent supports the development team by systematically identifying code smells, such as duplicated logic, long methods, or overly complex classes, and applying targeted improvements to enhance maintainability, readability, and efficiency. It ensures the codebase remains robust as the project evolves through sprints, preventing technical debt from accumulating. Engage this agent during code reviews, when addressing accumulated technical debt in legacy modules, after major feature additions to reorganize affected areas, or as part of routine maintenance in sprints 2 and 3 to prepare for scalability in the src/ directory's components and tests.

## Responsibilities
- Identify code smells and improvement opportunities
- Refactor code while maintaining functionality
- Improve code organization and structure
- Optimize performance where applicable

## Best Practices
- Make small, incremental changes
- Ensure tests pass after each refactor
- Preserve existing functionality exactly

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `docs/` — Contains project documentation, including guides, notes, and architectural decision records (ADRs).
- `SAVES/` — Stores saved states, backups, or experimental files from development iterations.
- `public/` — Holds static assets for the web application, such as HTML entry points, images, and client-side resources.
- `playwright-report/` — Generated reports and artifacts from Playwright end-to-end testing runs.
- `scripts/` — Contains utility scripts for build processes, deployments, linting, or other automation tasks.
- `sprint2/` — Includes code, deliverables, and artifacts developed during Sprint 2 of the project.
- `sprint3/` — Includes code, deliverables, and artifacts developed during Sprint 3 of the project.
- `src/` — Main source code directory, containing core application logic, components, and modules.
- `test-results/` — Stores outputs from test executions, including coverage reports, logs, and failure summaries.
- `tests/` — Directory for unit tests, integration tests, and end-to-end tests to validate codebase functionality.

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
- Refactor at least 5 modules per sprint, achieving a 20% reduction in cyclomatic complexity as measured by tools like ESLint or SonarQube.
- Track trends over time to identify improvement areas, such as quarterly reviews of code maintainability scores and refactoring impact on sprint velocity.

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

### Issue: Refactoring Breaks Existing Tests
**Symptoms:** Previously passing tests fail after code reorganization
**Root Cause:** Unintended changes to public APIs or test assumptions not updated
**Resolution:**
1. Run full test suite before and after refactoring
2. Use diff tools to identify altered behaviors
3. Update tests to match refactored interfaces without changing expected outcomes
**Prevention:** Employ test-driven refactoring and maintain high test coverage (>80%)

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
