<!-- agent-update:start:docs-index -->
# Documentation Index

Welcome to the repository knowledge base. Start with the project overview, then dive into specific guides as needed.

## Core Guides
- [Project Overview](./project-overview.md)
- [Architecture Notes](./architecture.md)
- [Development Workflow](./development-workflow.md)
- [Testing Strategy](./testing-strategy.md)
- [Glossary & Domain Concepts](./glossary.md)
- [Data Flow & Integrations](./data-flow.md)
- [Security & Compliance Notes](./security.md)
- [Tooling & Productivity Guide](./tooling.md)

## Firebase Documentation
- [Firebase Quick Start](./firebase-quick-start.md) - ⚡ Guia rápido para começar a usar
- [Firebase Architecture](./firebase-architecture.md) - Arquitetura de sincronização e schema do Firestore
- [Firebase Setup Guide](./firebase-setup.md) - Guia passo a passo para configurar Firebase
- [Firebase Migration Strategy](./firebase-migration-strategy.md) - Estratégia detalhada de migração de dados
- [Firebase Questions](./firebase-questions.md) - Questões e decisões sobre a implementação

## Repository Snapshot
- `package.json` — Project metadata and scripts.
- `package-lock.json` — NPM dependency lockfile.
- `playwright.config.js` — Playwright test configuration.
- `vite.config.js` — Vite build tool configuration.
- `README.md` — Repository root readme.
- `docs/` — Documentation and reference materials.
- `public/` — Static public assets and resources.
- `SAVES/` — Saved files or backups directory.
- `scripts/` — Utility scripts and automation tools.
- `src/` — TypeScript source files and CLI entrypoints.
- `sprint2/` — Deliverables from sprint 2.
- `sprint3/` — Deliverables from sprint 3.
- `tests/` — Automated tests and fixtures.
- `playwright-report/` — Generated reports from Playwright tests.
- `test-results/` — Aggregated test results and artifacts.

## Document Map
| Guide | File | AI Marker | Primary Inputs |
| --- | --- | --- | --- |
| Project Overview | `project-overview.md` | agent-update:project-overview | Roadmap, README, stakeholder notes |
| Architecture Notes | `architecture.md` | agent-update:architecture-notes | ADRs, service boundaries, dependency graphs |
| Development Workflow | `development-workflow.md` | agent-update:development-workflow | Branching rules, CI config, contributing guide |
| Testing Strategy | `testing-strategy.md` | agent-update:testing-strategy | Test configs, CI gates, known flaky suites |
| Glossary & Domain Concepts | `glossary.md` | agent-update:glossary | Business terminology, user personas, domain rules |
| Data Flow & Integrations | `data-flow.md` | agent-update:data-flow | System diagrams, integration specs, queue topics |
| Security & Compliance Notes | `security.md` | agent-update:security | Auth model, secrets management, compliance requirements |
| Tooling & Productivity Guide | `tooling.md` | agent-update:tooling | CLI scripts, IDE configs, automation workflows |
| Firebase Quick Start | `firebase-quick-start.md` | agent-update:firebase-quick-start | Firebase console setup, initial auth config |
| Firebase Architecture | `firebase-architecture.md` | agent-update:firebase-architecture | Firestore schema, sync patterns, real-time rules |
| Firebase Setup Guide | `firebase-setup.md` | agent-update:firebase-setup | Environment variables, SDK installation, project linking |
| Firebase Migration Strategy | `firebase-migration-strategy.md` | agent-update:firebase-migration-strategy | Data export/import scripts, validation steps, rollback plans |
| Firebase Questions | `firebase-questions.md` | agent-update:firebase-questions | Open issues, trade-offs, implementation decisions |

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Gather context with `git status -sb` plus the latest commits touching `docs/` or `agents/`.
2. Compare the current directory tree against the table above; add or retire rows accordingly.
3. Update cross-links if guides moved or were renamed; keep anchor text concise.
4. Record sources consulted inside the commit or PR description for traceability.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Repository tree and `package.json` scripts for canonical command names.
- Maintainer-approved issues, RFCs, or product briefs referenced in the repo.
- Release notes or changelog entries that announce documentation changes.

<!-- agent-update:end -->
