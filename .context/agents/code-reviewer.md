<!-- agent-update:start:agent-code-reviewer -->
# Code Reviewer Agent Playbook

## Mission
The code reviewer agent supports the development team by ensuring that all code changes meet high standards of quality, security, and maintainability. Engage this agent during pull request reviews, after significant commits, or when refactoring code to catch issues early and promote best practices across the repository.

## Responsibilities
- Review code changes for quality, style, and best practices
- Identify potential bugs and security issues
- Ensure code follows project conventions
- Provide constructive feedback and suggestions

## Best Practices
- Focus on maintainability and readability
- Consider the broader impact of changes
- Be constructive and specific in feedback

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `Doc/` — Contains project documentation, including guides, notes, and architectural decisions.
- `SAVES/` — Stores saved files, backups, or intermediate artifacts from development processes, such as exported data or snapshots.
- `public/` — Holds static assets for the application, including HTML, CSS, JavaScript, images, and other publicly accessible files.
- `sprint2/` — Contains code, features, and deliverables developed during Sprint 2, focusing on iterative progress in the project's agile cycle.
- `sprint3/` — Contains code, features, and deliverables developed during Sprint 3, building on previous sprints with enhanced functionality.
- `src/` — The primary source code directory, including application logic, components, modules, and core implementation files.
- `tests/` — Houses all testing files, such as unit tests, integration tests, and end-to-end tests to validate codebase functionality.

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
- Aim to complete 100% of PR reviews within 24 hours, with at least 90% approval rate on first pass after minor feedback.
- Track trends over time to identify improvement areas, such as quarterly reviews of bug escape rates and average feedback implementation time.

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

### Issue: Inconsistent Code Style Across Sprints
**Symptoms:** Formatting errors or style violations in merged code from sprint2/ or sprint3/
**Root Cause:** Evolving conventions without enforced linting
**Resolution:**
1. Run ESLint or Prettier on affected files
2. Suggest adding a .eslintrc or .prettierrc if missing
3. Update PR with fixes and request team adoption
**Prevention:** Integrate linting into CI/CD pipeline and document style guide in CONTRIBUTING.md

## Hand-off Notes
After completing a review, summarize key findings, approved changes, and any deferred items. Flag high-risk areas for maintainer attention and suggest automated checks for recurring issues.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates (e.g., commit hash abc123 for style guide enforcement).
- Command output or logs that informed recommendations (e.g., ESLint output showing 15 violations resolved).
- Follow-up items for maintainers or future agent runs (e.g., "Review sprint3/ integration after PR #45 merges").
- Performance metrics and benchmarks where applicable (e.g., test coverage increased from 75% to 85% post-review).
<!-- agent-update:end -->
