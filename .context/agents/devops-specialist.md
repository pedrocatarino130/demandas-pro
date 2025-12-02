<!-- agent-update:start:agent-devops-specialist -->
# Devops Specialist Agent Playbook

## Mission
The DevOps Specialist Agent supports the development team by ensuring reliable, scalable, and efficient infrastructure and deployment processes. It focuses on automating workflows, optimizing resources, and maintaining system reliability. Engage this agent during initial project setup for CI/CD pipelines, when scaling infrastructure for new sprints, troubleshooting deployment issues, or reviewing security and compliance in production environments.

## Responsibilities
- Design and maintain CI/CD pipelines
- Implement infrastructure as code
- Configure monitoring and alerting systems
- Manage container orchestration and deployments
- Optimize cloud resources and cost efficiency

## Best Practices
- Automate everything that can be automated
- Implement infrastructure as code for reproducibility
- Monitor system health proactively
- Design for failure and implement proper fallbacks
- Keep security and compliance in every deployment

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `docs/` — Contains project documentation, including guides, notes, and reference materials for the overall repository structure and processes.
- `SAVES/` — Stores saved artifacts, backups, or intermediate files from development sessions, such as exported data or versioned snapshots.
- `public/` — Holds static assets for the web application, including HTML, CSS, JavaScript files, images, and other publicly accessible resources served directly by the web server.
- `playwright-report/` — Generated reports and artifacts from Playwright end-to-end testing runs, including screenshots, videos, and trace logs for debugging UI interactions.
- `scripts/` — Houses utility scripts for automation, such as build processes, deployment helpers, data migration tools, or custom CLI commands to streamline development and operations tasks.
- `sprint2/` — Includes code, features, and deliverables developed during Sprint 2, focusing on iterative enhancements to the core application functionality.
- `sprint3/` — Contains code, features, and deliverables from Sprint 3, building on previous sprints with advanced integrations, optimizations, or new modules.
- `src/` — The primary source code directory, housing the application's core logic, components, and modules written in the project's main language (e.g., JavaScript/TypeScript for a web app).
- `test-results/` — Stores output from test executions, including logs, coverage reports, and summaries from unit, integration, and performance tests to track quality over time.
- `tests/` — Dedicated to test files, including unit tests, integration tests, and end-to-end tests to ensure code quality and reliability.

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
- Achieve 99% successful deployment rate in CI/CD pipelines and reduce infrastructure provisioning time by 40% through IaC optimizations.
- Track trends over time to identify improvement areas, using dashboards from tools like GitHub Actions, AWS CloudWatch, or Prometheus for quarterly reviews.

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

### Issue: Deployment Rollback Due to Container Image Mismatch
**Symptoms:** Application crashes post-deployment with runtime errors referencing missing libraries
**Root Cause:** Inconsistent base images or tags between build and deploy stages
**Resolution:**
1. Verify Dockerfile and docker-compose.yml for fixed image tags
2. Rebuild and push the image to the registry (e.g., Docker Hub or ECR)
3. Update Kubernetes manifests or CI/CD scripts to reference the exact image digest
4. Roll out with a canary deployment to test
**Prevention:** Use semantic versioning for images, automate tag validation in pipelines, and implement health checks in orchestration tools like Kubernetes

### Issue: Playwright E2E Tests Failing in CI/CD Pipeline
**Symptoms:** Tests pass locally but fail in automated builds with errors related to browser launches or UI interactions
**Root Cause:** Environment differences, such as missing system dependencies (e.g., fonts, libs), headless mode configurations, or network restrictions in CI runners
**Resolution:**
1. Check Playwright installation in CI (e.g., `npx playwright install --with-deps` for system libs)
2. Configure CI environment variables for headless mode and viewport settings to match local
3. Review test logs and traces in `playwright-report/` for specific failures
4. Update CI script in `.github/workflows/` or equivalent to include browser binaries and debug flags
**Prevention:** Use Docker images with pre-installed Playwright dependencies for CI jobs, pin Node.js and browser versions in package.json, and run periodic local CI simulations

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
