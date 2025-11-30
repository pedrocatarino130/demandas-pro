```markdown
<!-- agent-update:start:architecture-notes -->
# Architecture Notes

The system is a frontend web application developed iteratively across sprints, utilizing Vite as the build tool for a modern JavaScript/TypeScript stack. The design emphasizes modular development in `src/`, with separate sprint directories (`sprint2/`, `sprint3/`) for feature isolation during agile cycles. This structure supports rapid prototyping and testing with Playwright, while maintaining a lightweight deployment suitable for static hosting.

## System Architecture Overview
The application follows a monolithic frontend architecture, structured as a single-page application (SPA) bundled by Vite. Requests are handled client-side: the `index.html` entry point loads assets from `public/`, initializes the app from `src/`, and renders dynamically via JavaScript modules. Control flows from the entry point through imported components and utilities in `src/`, with no server-side rendering in the current setup. Deployment is static-file based, deployable to CDNs or simple web servers, with sprints representing phased enhancements (e.g., `sprint2/` for initial features, `sprint3/` for refinements).

## Core System Components
- `Doc/` — Documentation files (approximately 5 files), including guides and notes.
- `SAVES/` — Backup or saved artifacts (approximately 2 files).
- `public/` — Static assets like images and favicons (approximately 2 files).
- `sprint2/` — Feature implementations from sprint 2 (approximately 6 files), focusing on core UI and logic.
- `sprint3/` — Feature implementations from sprint 3 (approximately 6 files), including enhancements and integrations.
- `src/` — Main application source code, including components, utilities, and app entry (approximately 52 files).
- `tests/` — Test suites, likely using Playwright or similar (approximately 8 files).

Configuration and tooling:
- `package.json` and `package-lock.json` — NPM dependencies and scripts.
- `vite.config.js` — Vite build configuration for development and production.
- `playwright.config.js` — End-to-end testing setup.
- `index.html` — Application entry point.
- `README.md` — Project root documentation.

## Internal System Boundaries
The system is primarily frontend-focused, with bounded contexts in `src/` divided by sprints (e.g., `sprint2/` owns initial data handling, `sprint3/` extends with UI interactions). Data flows are client-side only, with no persistent storage seams; any state is managed in-memory or via localStorage. Synchronization is not applicable internally, but sprint folders enforce feature isolation to prevent cross-contamination during development. Shared contracts are minimal, relying on ES modules for imports.

## System Integration Points
Inbound interfaces are limited to browser events and URL routing handled by the Vite dev server or router in `src/`. Outbound, the app likely orchestrates API calls from `src/` modules (e.g., fetch to external endpoints for data like `dados.json` references). No explicit event buses or webhooks; coordination with other services would occur via HTTP requests triggered from components in sprint directories.

## External Service Dependencies
- None explicitly identified in the repository structure. Potential implicit dependencies include:
  - NPM ecosystem (e.g., Vite, React/Vue if used) for build-time.
  - Browser APIs for runtime (e.g., DOM, Fetch).
  - If data fetching is implemented, external APIs (not specified; assume standard HTTP with no auth/rate limits documented).
Failure handling: Client-side error boundaries in `src/` should catch fetch failures; no resilience patterns like retries are evident.

## Key Decisions & Trade-offs
- **Vite over Webpack**: Chosen for faster HMR and simpler config, reducing build times in iterative sprints (trade-off: less mature plugin ecosystem but sufficient for this scale).
- **Sprint-based Folder Structure**: Enables parallel development and easy rollback (e.g., `sprint2/` as baseline), but introduces temporary duplication; planned consolidation post-sprint3.
- **Playwright for Testing**: Selected for cross-browser E2E tests over Jest for UI fidelity (trade-off: heavier setup but better for SPA validation).
- No backend integration yet: Keeps scope frontend-only, deferring full-stack to future sprints (avoids complexity but limits data persistence).
Supporting docs: See sprint folders for commit histories; no formal ADRs yet.

## Diagrams
```mermaid
graph TD
    A[Browser Request] --> B[index.html]
    B --> C[Vite Bundler]
    C --> D[src/ Components & Logic]
    D --> E[sprint2/ Features]
    D --> F[sprint3/ Enhancements]
    E --> G[External APIs?]
    F --> G
    H[tests/] --> I[Playwright Runner]
    I --> D
    J[public/ Assets] --> B
```

This diagram illustrates the high-level flow from entry to rendering, with testing oversight.

## Risks & Constraints
- **Performance**: Large `src/` (52 files) may impact bundle size; monitor with Vite analytics. Constraint: Client-side only, so offline support limited without service workers.
- **Scaling**: Suitable for low-traffic SPAs; high concurrency requires CDN optimization. Assumption: No real-time features, but sprint3 may introduce async ops.
- **Technical Debt**: Sprint folders risk fragmentation; plan migration to unified `src/` post-sprint3. Active risks: Undocumented external API dependencies could introduce breakage.
- **Testing Coverage**: 8 test files suggest focus on E2E; unit tests may be sparse.

## Top Directories Snapshot
- `Doc/` — approximately 5 files (documentation).
- `SAVES/` — approximately 2 files (backups).
- `public/` — approximately 2 files (static assets).
- `sprint2/` — approximately 6 files (sprint 2 features).
- `sprint3/` — approximately 6 files (sprint 3 features).
- `src/` — approximately 52 files (core source).
- `tests/` — approximately 8 files (test suites).

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Review ADRs, design docs, or major PRs for architectural changes.
2. Verify that each documented decision still holds; mark superseded choices clearly.
3. Capture upstream/downstream impacts (APIs, events, data flows).
4. Update Risks & Constraints with active incident learnings or TODO debt.
5. Link any new diagrams or dashboards referenced in recent work.

<!-- agent-readonly:sources -->
## Acceptable Sources
- ADR folders, `/docs/architecture` notes, or RFC threads.
- Dependency visualisations from build tooling or scripts.
- Issue tracker discussions vetted by maintainers.

## Related Resources
- [Project Overview](./project-overview.md)
- Update [agents/README.md](../agents/README.md) when architecture changes.

<!-- agent-update:end -->
```
