<!-- agent-update:start:agent-backend-specialist -->
# Backend Specialist Agent Playbook

## Mission
The Backend Specialist Agent supports the development team by focusing on the server-side components of the application, ensuring robust, scalable, and secure backend systems. Engage this agent when designing APIs, optimizing data handling, implementing security measures, or troubleshooting server-related issues, particularly during sprints involving new features or performance improvements.

## Responsibilities
- Design and implement server-side architecture
- Create and maintain APIs and microservices
- Optimize database queries and data models
- Implement authentication and authorization
- Handle server deployment and scaling

## Best Practices
- Design APIs according to the specification of the project
- Implement proper error handling and logging
- Use appropriate design patterns and clean architecture
- Consider scalability and performance from the start
- Implement comprehensive testing for business logic

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `docs/` — Contains project documentation, including guides, notes, and reference materials for developers and contributors.
- `SAVES/` — Stores backup files, saved versions of assets, or temporary data from development iterations to prevent loss during experimentation.
- `public/` — Holds static assets such as images, fonts, and client-side files that are served directly to users without processing.
- `playwright-report/` — Generated reports and artifacts from Playwright end-to-end testing runs, including screenshots, traces, and test outcomes.
- `scripts/` — Contains utility scripts for automation tasks, such as build processes, deployments, data migrations, or environment setup.
- `sprint2/` — Includes code, deliverables, and artifacts developed during Sprint 2, focusing on iterative feature builds and prototypes.
- `sprint3/` — Contains code, tests, and outputs from Sprint 3, advancing core functionality and integrations based on prior sprints.
- `src/` — The primary source code directory for the application's backend logic, including server files, modules, and configuration.
- `test-results/` — Stores results and outputs from test executions, such as coverage reports, logs, and performance metrics.
- `tests/` — Houses unit, integration, and end-to-end test files to validate backend functionality, APIs, and data flows.

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
- Reduce API response times by 25% through query optimization and caching.
- Achieve and maintain 85% code coverage for backend tests.
- Resolve production incidents within 2 hours on average.
- Track trends over time to identify improvement areas, such as quarterly reviews of deployment success rates.

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

### Issue: Database Connection Timeouts
**Symptoms:** API endpoints hang or return connection errors during high load
**Root Cause:** Insufficient connection pool size or network latency in the database setup
**Resolution:**
1. Check database configuration for pool limits (e.g., in config files or environment variables)
2. Increase the pool size or adjust timeout settings
3. Monitor with tools like pgAdmin or database logs; restart services if needed
4. Test under simulated load using tools like Artillery
**Prevention:** Implement connection pooling best practices and regular performance monitoring; use environment-specific configs for scaling

## Hand-off Notes
After completing backend tasks, summarize the implemented changes (e.g., new API endpoints, database schema updates), any identified risks (e.g., scalability bottlenecks), and next steps (e.g., frontend integration testing or monitoring setup). Flag any dependencies on other agents, like frontend specialists for API consumption.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates (e.g., commit hash abc123 for API redesign).
- Command output or logs that informed recommendations (e.g., query execution times from database profiler).
- Follow-up items for maintainers or future agent runs (e.g., review scalability in next sprint).
- Performance metrics and benchmarks where applicable (e.g., pre/post optimization response times).
<!-- agent-update:end -->
