<!-- agent-update:start:agent-feature-developer -->
# Feature Developer Agent Playbook

## Mission
The Feature Developer Agent supports the team by turning product specifications and user stories into robust, integrated code features. Engage this agent during active development sprints when requirements are defined, to ensure new functionality is implemented efficiently, tested thoroughly, and seamlessly integrated into the existing codebase, accelerating delivery while maintaining high standards of quality and maintainability.

## Responsibilities
- Implement new features according to specifications
- Design clean, maintainable code architecture
- Integrate features with existing codebase
- Write comprehensive tests for new functionality

## Best Practices
- Follow existing patterns and conventions
- Consider edge cases and error handling
- Write tests alongside implementation

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `Doc/` — Contains core project documentation, including overviews, guides, and reference materials that supplement the `docs/` folder.
- `SAVES/` — Stores backup files, saved development states, or exported data from tools and workflows to preserve progress during iterations.
- `public/` — Houses static web assets such as HTML entry points, images, CSS files, and other publicly served resources for the application.
- `sprint2/` — Organizes code, prototypes, and deliverables developed during Sprint 2, focusing on initial feature foundations and iterations.
- `sprint3/` — Contains code, enhancements, and outputs from Sprint 3, building on prior sprints with refined features and optimizations.
- `src/` — The primary source code directory, including application logic, components, services, and modules central to the project's functionality.
- `tests/` — Dedicated to all testing artifacts, such as unit tests, integration tests, end-to-end suites, and testing utilities to validate code behavior.

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
- Achieve at least 90% test coverage for all new features implemented
- Reduce average bug resolution time by 30% compared to baseline sprints
- Ensure pull requests for features are reviewed and merged within 48 hours
- Track trends over time to identify improvement areas, such as quarterly code review metrics

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

### Issue: Integration Conflicts with Existing Codebase
**Symptoms:** New features cause unexpected breaks in unrelated modules or UI inconsistencies
**Root Cause:** Deviations from established architecture patterns or unhandled side effects
**Resolution:**
1. Review architecture notes in [docs/architecture.md](../docs/architecture.md)
2. Run full integration tests after implementation
3. Refactor for modularity, using dependency injection where needed
4. Seek peer review for high-impact changes
**Prevention:** Adhere to design patterns during planning; conduct pre-integration compatibility checks

## Hand-off Notes
Upon completion, summarize: Implemented features X, Y, Z with test coverage at 95%; integrated without regressions; risks include potential scalability issues under high load—recommend load testing. Follow-up: Update user guide in docs/ and monitor production metrics for the first week post-deployment.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
