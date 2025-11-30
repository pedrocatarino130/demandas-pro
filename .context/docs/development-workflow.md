<!-- agent-update:start:development-workflow -->
# Development Workflow

Outline the day-to-day engineering process for this repository.

## Branching & Releases
- This repository follows a trunk-based development model with a protected `main` branch as the trunk. Developers create short-lived feature branches (e.g., `feature/sprint3-login`) from `main` for new work, especially aligned with sprint cycles (evident from directories like `sprint2` and `sprint3`).
- Releases occur on an as-needed basis tied to sprint completions, using semantic versioning tags (e.g., `v1.2.0`) directly on `main` after merging features. No automated CI/CD pipelines are currently configured for releases; tagging is manual via Git (e.g., `git tag v1.2.0 && git push origin v1.2.0`). Check recent tags with `git tag` for the latest version history.

## Local Development
- Commands to install dependencies: `npm install`
- Run the CLI locally: `npm run dev` (starts the development server, typically on `http://localhost:3000` for web apps; adjust ports if needed based on `package.json` scripts).
- Build for distribution: `npm run build` (outputs optimized assets to a `dist` or `build` directory, ready for deployment).

Additional setup: Clone the repo with `git clone <repo-url>`, then run `npm install`. For testing, use `npm test` if defined in `package.json`. The project structure includes `src` for source code, `public` for static assets, `tests` for test files, and sprint-specific directories (`sprint2`, `sprint3`) for ongoing features.

## Code Review Expectations
- All changes require a pull request (PR) to `main` with at least one approval from a core maintainer. Reviews should check for code quality, test coverage (run `npm test` before submitting), adherence to existing patterns in `src`, and updates to documentation if applicable.
- Use checklists in PR templates (if enabled in repo settings) to verify: no breaking changes, linting passes (`npm run lint`), and sprint alignment. Reference [AGENTS.md](../../AGENTS.md) for agent collaboration tips, such as involving AI agents in initial drafts or reviews.

## Onboarding Tasks
- Newcomers should review the repository structure (e.g., `src` for core logic, sprint directories for current work) and set up their local environment as described above.
- Start with issues labeled "good first issue" or low-hanging fruit in sprint backlogs (track via GitHub Issues or a tool like Jira if integrated). Initial tasks include bug fixes in `tests` or minor features in `sprint3`. Link to internal runbooks: See [docs/architecture.md](architecture.md) for system overview and any project dashboards (e.g., GitHub Projects board at `<repo>/projects/1`).

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Confirm branching/release steps with CI configuration and recent tags.
2. Verify local commands against `package.json`; ensure flags and scripts still exist.
3. Capture review requirements (approvers, checks) from contributing docs or repository settings.
4. Refresh onboarding links (boards, dashboards) to their latest URLs.
5. Highlight any manual steps that should become automation follow-ups.

<!-- agent-readonly:sources -->
## Acceptable Sources
- CONTRIBUTING guidelines and `AGENTS.md`.
- Build pipelines, branch protection rules, or release scripts.
- Issue tracker boards used for onboarding or triage.

<!-- agent-update:end -->
