<!-- agent-update:start:project-overview -->
# Project Overview

This project, named "demandas," is a web-based application designed to manage and track demands or requests, likely in a legal, administrative, or customer service context (based on the project name, which means "demands" or "claims" in Portuguese). It solves the problem of organizing, processing, and visualizing demand-related data efficiently, benefiting end-users such as administrators, legal teams, or support staff who need streamlined workflows for handling incoming requests, status updates, and reporting.

## Quick Facts
- Root path: Project root (e.g., `./demandas/`)
- Primary languages detected:
  - .js (59 files)
  - .css (15 files)
  - .md (7 files)
  - .json (6 files)
  - .html (2 files)

## File Structure & Code Organization
- `docs/` — Contains project documentation, including guides, notes, and reference materials for developers and contributors.
- `SAVES/` — Stores saved states, backups, or archived versions of data, configurations, or outputs from development sprints or testing sessions.
- `public/` — Holds static assets for the web application, such as images, fonts, and other files served directly to the browser without processing.
- `re-desing/` — Dedicated to redesign efforts, including updated components, prototypes, or iterative improvements to the user interface and architecture.
- `sprint2/` — Dedicated to code, components, and features developed during Sprint 2 of the project, organizing iterative progress.
- `sprint3/` — Contains code, components, and features from Sprint 3, reflecting ongoing development and refinements.
- `src/` — TypeScript source files and CLI entrypoints.
- `tests/` — Automated tests and fixtures.
- Root-level files include:
  - `package.json` — Defines project dependencies, scripts, and metadata for Node.js/npm management.
  - `package-lock.json` — Locks dependency versions for reproducible installations.
  - `playwright.config.js` — Configuration for Playwright end-to-end testing framework.
  - `vite.config.js` — Configuration for the Vite build tool, handling development server, bundling, and optimization.
  - `README.md` — Main entry point with project setup, usage, and contribution instructions.
  - Other potential files: `index.html` (main entry HTML), `estudos.html` (possibly a study or demo page).

## Technology Stack Summary
The project leverages Node.js as the runtime environment, with JavaScript as the primary language (supplemented by TypeScript in source files). Build tooling includes Vite for fast development and production bundling. Linting and formatting are likely handled via ESLint and Prettier (inferred from standard JS projects; confirm via `package.json` devDependencies). Testing infrastructure uses Playwright for browser-based E2E tests.

## Core Framework Stack
- **Frontend**: Vite-based setup, likely with a framework like React or Vanilla JS for building interactive UIs (check `src/` for specifics; no explicit framework detected in scans).
- **Backend/Data**: Node.js for any server-side logic or data handling; JSON files for static data storage (e.g., in `SAVES/` or root).
- **Testing**: Playwright for cross-browser automation.
- Architectural patterns: Modular structure following sprint-based development, with separation of concerns (e.g., `src/` for logic, `public/` for assets). Emphasizes iterative sprints for agile progression.

## UI & Interaction Libraries
- UI: Standard HTML/CSS/JS; potential use of CSS frameworks (e.g., Bootstrap or Tailwind, based on .css file count—verify dependencies).
- Interaction: Browser-native for web views; no CLI-specific libraries noted, but `src/` may include script runners.
- Considerations: Ensure responsive design for web accessibility; localization may be needed for Portuguese/English (project name suggests bilingual potential). Follow WCAG guidelines for UI components in `public/` and `src/`.

## Development Tools Overview
- Essential CLIs: `npm` for package management, `npx playwright` for testing, `vite` for dev server.
- Scripts: Run `npm run dev` to start the development server; `npm test` for running tests.
- Environments: Node.js (v18+ recommended), modern browser for previews.
- Link to [Tooling & Productivity Guide](./tooling.md) for deeper setup instructions.

## Getting Started Checklist
1. Install dependencies with `npm install`.
2. Explore the CLI by running `npm run dev`.
3. Review [Development Workflow](./development-workflow.md) for day-to-day tasks.

## Next Steps
Position the product as an agile web tool for demand management, with key stakeholders including developers (for sprints), product owners (for features in `sprint2/`, `sprint3/`, and `re-desing/`), and end-users (for UI in `public/`). External resources: Refer to GitHub repo issues for roadmap; no product specs linked yet—suggest adding a `docs/product-specs.md`. For collaboration, see sprint directories for progress tracking.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Review roadmap items or issues labelled “release” to confirm current goals.
2. Cross-check Quick Facts against `package.json` and environment docs.
3. Refresh the File Structure & Code Organization section to reflect new or retired modules; keep guidance actionable.
4. Link critical dashboards, specs, or runbooks used by the team.
5. Flag any details that require human confirmation (e.g., stakeholder ownership).

<!-- agent-readonly:sources -->
## Acceptable Sources
- Recent commits, release notes, or ADRs describing high-level changes.
- Product requirement documents linked from this repository.
- Confirmed statements from maintainers or product leads.

<!-- agent-update:end -->
