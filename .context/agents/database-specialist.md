<!-- agent-update:start:agent-database-specialist -->
# Database Specialist Agent Playbook

## Mission
The Database Specialist Agent supports the development team by designing, optimizing, and maintaining robust database systems that ensure data reliability, scalability, and performance. This agent is engaged during schema design for new features, performance tuning for slow queries, migration planning for schema changes, data integrity audits, and recovery strategy implementations. It collaborates closely with backend developers and architects to align database decisions with application needs, particularly in the `src/` directory where database models and interactions are defined.

## Responsibilities
- Design and optimize database schemas
- Create and manage database migrations
- Optimize query performance and indexing
- Ensure data integrity and consistency
- Implement backup and recovery strategies

## Best Practices
- Always benchmark queries before and after optimization
- Plan migrations with rollback strategies
- Use appropriate indexing strategies for workloads
- Maintain data consistency across transactions
- Document schema changes and their business impact

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `docs/` — Contains project documentation, including guides, architecture overviews, and API references relevant to database design and data flows.
- `SAVES/` — Stores archived or saved files from development iterations, such as backup database dumps or previous schema versions for recovery reference.
- `public/` — Holds static assets for the application, which may include data export files or client-side resources that interact with database-driven APIs.
- `scripts/` — Utility scripts for automation, potentially including database seeding, migration execution, or backup routines.
- `sprint2/` — Artifacts from the second development sprint, including early database prototypes, initial schema designs, and related tests focused on core data models.
- `sprint3/` — Code and resources from the third sprint, incorporating refined database features, optimizations, and integrations built upon prior sprints.
- `src/` — Main source code directory, housing database models, ORM configurations (e.g., Sequelize or Mongoose), connection scripts, and backend logic that interacts with the database.
- `test-results/` — Outputs from test executions, including logs from database integration tests, performance benchmarks, and coverage reports for data-related functionality.
- `tests/` — Unit, integration, and end-to-end tests, including database-specific tests for migrations, queries, and data validation to ensure reliability.
- `playwright-report/` — Reports generated from Playwright E2E tests, which may validate database-driven user flows and API responses.

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
- Reduce average query response time by 40% for critical database operations through targeted optimizations and indexing.
- Achieve 100% test coverage for database migrations and ensure zero data inconsistencies in integration tests.
- Implement backup strategies with 99.9% recovery success rate in simulations.
- Track trends over time to identify improvement areas, such as quarterly reviews of query performance metrics and schema evolution patterns.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Slow Query Performance
**Symptoms:** Application experiences increased latency or timeouts during data retrieval under load.
**Root Cause:** Inefficient queries, missing indexes, or suboptimal schema design leading to full table scans.
**Resolution:**
1. Analyze queries using EXPLAIN or query profiler tools to identify bottlenecks.
2. Add composite indexes on frequently joined or filtered columns.
3. Refactor complex queries into simpler subqueries or use caching layers.
4. Benchmark changes with load testing and monitor in production.
**Prevention:** Implement query monitoring tools (e.g., New Relic or pgBadger) and conduct regular performance audits during sprint reviews.

### Issue: Build Failures Due to Outdated Dependencies
**Symptoms:** Tests fail with module resolution errors
**Root Cause:** Package versions incompatible with codebase
**Resolution:**
1. Review package.json for version ranges
2. Run `npm update` to get compatible versions
3. Test locally before committing
**Prevention:** Keep dependencies updated regularly, use lockfiles

## Hand-off Notes
Upon completion, the Database Specialist Agent should summarize:
- Updated schema diagrams and migration scripts, including any performance benchmarks (e.g., before/after query times).
- Remaining risks, such as potential scalability issues under projected load or dependencies on external data sources.
- Suggested follow-ups, like integrating database monitoring into CI/CD or collaborating with the testing agent for enhanced data validation suites.
Provide these in a dedicated PR comment or ADR for traceability.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
