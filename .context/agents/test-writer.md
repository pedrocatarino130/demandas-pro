<!-- agent-update:start:agent-test-writer -->
# Test Writer Agent Playbook

## Mission
Describe how the test writer agent supports the team and when to engage it.

## Responsibilities
- Write comprehensive unit and integration tests
- Ensure good test coverage across the codebase
- Create test utilities and fixtures
- Maintain and update existing tests

## Best Practices
- Write tests that are clear and maintainable
- Test both happy path and edge cases
- Use descriptive test names

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `Doc/` — Contains project documentation, including guides, architecture notes, and contributor resources.
- `SAVES/` — Stores saved states, backups, or archived configurations from development sprints.
- `public/` — Holds static assets such as images, CSS, JavaScript files, and other publicly accessible resources for the frontend.
- `sprint2/` — Includes code, deliverables, and artifacts developed during Sprint 2 of the project.
- `sprint3/` — Includes code, deliverables, and artifacts developed during Sprint 3 of the project.
- `src/` — Main source code directory, containing core application logic, components, and modules.
- `tests/` — Dedicated directory for all test files, including unit tests, integration tests, and test utilities.

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

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
