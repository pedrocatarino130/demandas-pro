# Glossary & Domain Concepts

List project-specific terminology, acronyms, domain entities, and user personas.

## Core Terms
- **Scaffolding Tool** — A foundational framework used to generate initial project structures, including documentation templates and agent configurations. It appears in the `ai-context` setup scripts and is referenced in `package.json` under devDependencies for bootstrapping new repos.
- **Agent Playbook** — A set of instructional guidelines for AI agents, defining behaviors, update procedures, and collaboration rules. Defined in `agents/*.md` files and integrated into the documentation refresh workflows.
- **Sprint** — A time-boxed development iteration, typically lasting 2-4 weeks, focused on delivering a set of features or improvements. The repository organizes work into directories like `sprint2` and `sprint3` to track progress across agile cycles.
- **SAVES** — Directory for storing user data persistence files, such as saved states, configurations, or application snapshots, ensuring data recovery and continuity across sessions.
- **Src** — The primary source code directory containing application logic, components, modules, and utilities; serves as the core of the project's frontend implementation (e.g., React or similar framework-based code).
- **Public** — Directory for static assets that are served directly by the web server without processing, including entry points like `index.html`, images, CSS, and JavaScript bundles.
- **Playwright-report** — Directory containing reports and artifacts from Playwright end-to-end testing runs, used for debugging, traceability, and visualization in CI/CD pipelines.
- **Scripts** — Directory for executable scripts handling build processes, deployments, data migrations, testing automation, and other utility tasks; invoked via npm scripts defined in `package.json`.
- **Test-results** — Folder for aggregating outputs from test executions, including logs, coverage reports, and failure summaries from unit, integration, and E2E tests.
- **Tests** — Dedicated directory housing all test suites, including unit tests, integration tests, and end-to-end (E2E) tests; structured to parallel the `src/` organization for ease of maintenance and execution.

## Acronyms & Abbreviations
- **ADR** — Architectural Decision Record; a method for documenting significant architectural choices and their rationale. Used in the repository for tracking decisions related to tool integrations and workflow evolutions; linked to GitHub issues and PRs.
- **E2E** — End-to-End; a testing methodology that simulates real user scenarios across the full application stack, from UI to backend, primarily implemented with Playwright in this project.
- **CI/CD** — Continuous Integration/Continuous Deployment; practices and pipelines that automate code building, testing, and deployment upon changes, supported by configurations in `package.json`, `scripts/`, and external tools.

## Personas / Actors
- **AI Maintainer** — An AI-assisted role responsible for updating docs and playbooks; goals include ensuring consistency and resolving placeholders; key workflows involve scanning repo state via `git status` and editing within agent-update blocks; pain points addressed include manual drudgery in maintaining cross-references, automated via scaffolding tools.
- **Sprint Developer** — A human or collaborative role focused on implementing features within sprint directories (e.g., `sprint2`, `sprint3`); interacts with `src/` and `tests/` to build and validate code; relies on documentation for sprint planning and integration guidelines.

## Domain Rules & Invariants
- All documentation updates must preserve YAML front matter and agent-update wrappers to maintain compatibility with the scaffolding tool's parsing logic.
- Cross-references between docs and agents must use relative Markdown links (e.g., `[Guide](../docs/guide.md)`) to ensure portability across repo clones.
- No unresolved placeholders (`<!-- agent-fill:* -->`) are allowed in committed files unless flagged with a human-dependency comment; validation enforced in CI via linting and testing scripts in `scripts/` and `tests/`.
- Regional nuances: Documentation is written in US English; localization for terms (e.g., date formats in workflows) follows ISO 8601 standards to support global contributors.
- Repository structure enforces separation of concerns: Development artifacts in `sprint*` directories must integrate into `src/` upon completion, with tests covering at least 80% of new code (enforced via CI thresholds configured in `package.json` and `test-results/` analysis).

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Harvest terminology from recent PRs, issues, and discussions.
2. Confirm definitions with product or domain experts when uncertain.
3. Link terms to relevant docs or modules for deeper context.
4. Remove or archive outdated concepts; flag unknown terms for follow-up.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Product requirement docs, RFCs, user research, or support tickets.
- Service contracts, API schemas, data dictionaries.
- Conversations with domain experts (summarize outcomes if applicable).
