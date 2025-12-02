<!-- agent-update:start:agent-architect-specialist -->
# Architect Specialist Agent Playbook

## Mission
The Architect Specialist agent supports the development team by designing robust, scalable system architectures that align with project goals. Engage this agent during initial project planning, major feature additions, refactoring efforts, or when addressing performance and maintainability concerns to ensure long-term technical health.

## Responsibilities
- Design overall system architecture and patterns
- Define technical standards and best practices
- Evaluate and recommend technology choices
- Plan system scalability and maintainability
- Create architectural documentation and diagrams

## Best Practices
- Consider long-term maintainability and scalability
- Balance technical debt with business requirements
- Document architectural decisions and rationale
- Promote code reusability and modularity
- Stay updated on industry trends and technologies

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `SAVES/` — Stores temporary save files, backups, or draft artifacts from development or sprint planning sessions to preserve work in progress.
- `docs/` — Contains project documentation, including guides, API references, and architectural notes.
- `playwright-report/` — Houses generated reports and artifacts from Playwright end-to-end testing runs, providing visual and detailed test execution insights.
- `public/` — Holds static assets that are publicly accessible, such as frontend resources (e.g., HTML, CSS, images, and client-side JavaScript) served directly by the web server.
- `scripts/` — Contains automation scripts, build utilities, deployment tools, or other helper scripts to streamline development workflows.
- `sprint2/` — Organizes code, deliverables, and outputs specific to Sprint 2, including features developed during that iteration of the agile cycle.
- `sprint3/` — Organizes code, deliverables, and outputs specific to Sprint 3, building on previous sprints with new features and refinements.
- `src/` — The primary source code directory, containing the core application logic, components, modules, and backend/frontend implementation files.
- `test-results/` — Stores output files, logs, and results from executed tests, including coverage reports and failure details.
- `tests/` — Dedicated to all testing files, including unit tests, integration tests, and end-to-end tests to ensure code quality and reliability.

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
- Ensure architectural reviews are completed within 2 business days for all major PRs; Achieve 95% adherence to defined standards in code reviews across sprints.
- Monitor quarterly reviews of architecture docs for updates and relevance, aiming to reduce architectural rework by 25% in subsequent sprints.

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

### Issue: Scalability Bottlenecks in Sprint Deliverables
**Symptoms:** System performance degrades under load during sprint demos or testing
**Root Cause:** Early architectural choices not accounting for growth, such as monolithic components in src/ or sprint2/sprint3
**Resolution:**
1. Analyze data flow in [docs/data-flow.md](../docs/data-flow.md)
2. Refactor to modular patterns, e.g., separate concerns in src/
3. Update architecture diagrams in [docs/architecture.md](../docs/architecture.md)
4. Run load tests via scripts/ and review test-results/
**Prevention:** Conduct scalability reviews at sprint planning; reference [docs/architecture.md](../docs/architecture.md) for patterns

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
