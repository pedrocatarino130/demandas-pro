```markdown
<!-- agent-update:start:agent-performance-optimizer -->
# Performance Optimizer Agent Playbook

## Mission
The Performance Optimizer Agent supports the development team by proactively identifying and resolving performance bottlenecks in the codebase, ensuring the application delivers fast, efficient user experiences. Engage this agent during code reviews, after feature implementations, when user feedback highlights slowdowns, or as part of routine profiling in CI/CD pipelines to maintain optimal resource usage and scalability.

## Responsibilities
- Identify performance bottlenecks
- Optimize code for speed and efficiency
- Implement caching strategies
- Monitor and improve resource usage

## Best Practices
- Measure before optimizing
- Focus on actual bottlenecks
- Don't sacrifice readability unnecessarily

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `docs/` — Contains project documentation, including guides, architecture notes, and contributor resources.
- `SAVES/` — Stores saved snapshots, backups, or intermediate project states from development sprints.
- `public/` — Holds static assets like images, fonts, and the index.html file served by the web server.
- `scripts/` — Includes utility scripts for build processes, data handling, or automation tasks relevant to performance monitoring and optimization.
- `sprint2/` — Contains code, features, or deliverables developed during Sprint 2 of the project.
- `sprint3/` — Contains code, features, or deliverables developed during Sprint 3 of the project.
- `src/` — The main source code directory, including components, utilities, and application logic.
- `test-results/` — Stores outputs from automated tests, including performance benchmarks and profiling reports.
- `tests/` — Directory for unit, integration, and end-to-end tests.
- `playwright-report/` — Contains reports from Playwright end-to-end tests, useful for identifying UI performance issues.

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
- Reduce average page load time by 20% in key user flows
- Achieve sub-100ms response times for critical API endpoints
- Lower memory usage by 15% through efficient coding practices
- Track trends over time to identify improvement areas using tools like Lighthouse audits in CI or custom performance benchmarks in pull requests

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

### Issue: High Latency in Database Queries
**Symptoms:** Slow response times during data-heavy operations, high CPU usage on backend
**Root Cause:** Inefficient queries, missing indexes, or unoptimized joins in the data layer
**Resolution:**
1. Profile queries using database tools like EXPLAIN in SQL or query analyzers
2. Add database indexes on frequently queried columns
3. Refactor query logic in src/ to use efficient patterns, such as pagination or eager loading
4. Implement caching (e.g., Redis) for repeated queries
**Prevention:** Conduct regular query performance reviews during sprint planning and integrate query monitoring in the development workflow

### Issue: Slow Frontend Rendering in Sprint Deliverables
**Symptoms:** Delayed UI updates in sprint2/ or sprint3/ features, high bundle sizes affecting load times
**Root Cause:** Unoptimized assets in public/, inefficient component re-renders, or large script bundles
**Resolution:**
1. Analyze bundle sizes using tools like webpack-bundle-analyzer
2. Lazy-load components and optimize images in public/
3. Implement memoization or virtualization for lists in src/
4. Run Lighthouse audits on local dev server and review reports in playwright-report/
**Prevention:** Integrate bundle analysis and Lighthouse CI checks into PR workflows, review asset optimization during sprint retrospectives

## Hand-off Notes
After completing optimization tasks, the agent documents changes in an ADR (Architecture Decision Record) or performance log, includes before/after benchmarks in the PR, and recommends setting up monitoring alerts (e.g., via Sentry or New Relic) for potential regressions. Remaining risks include future feature additions that could reintroduce bottlenecks; suggest scheduling quarterly performance audits.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
```
