<!-- agent-update:start:tooling -->
# Tooling & Productivity Guide

Collect the scripts, automation, and editor settings that keep contributors efficient.

## Required Tooling
- **Node.js** — Install via [nodejs.org](https://nodejs.org/) or a version manager like nvm (recommended: v18.x or later). Powers the runtime for the application, npm scripts, and build processes. Verify with `node --version`.
- **npm** — Comes bundled with Node.js; use version 8.x or higher. Manages dependencies and runs scripts. Alternative: Yarn (v1.x) if specified in team prefs, but stick to npm for consistency. Check with `npm --version`.
- **Git** — Install from [git-scm.com](https://git-scm.com/). Version 2.30+ recommended. Essential for version control and contributing via PRs. Configure with `git config --global user.name "Your Name"` and `git config --global user.email "your.email@example.com"`.

## Recommended Automation
- **Pre-commit hooks** via Husky and lint-staged: Run `npm install --save-dev husky lint-staged` if not already set up. Configured in `package.json` to auto-format code and run ESLint/Prettier before commits, ensuring clean history.
- **Linting/Formatting**: Use ESLint (`npm install --save-dev eslint`) for code quality and Prettier (`npm install --save-dev prettier`) for consistent styling. Run manually with `npm run lint` or `npm run format`. Integrates with VS Code for real-time feedback.
- **Code generators/Scaffolding**: Leverage Create React App (CRA) for initial setup (`npx create-react-app my-app`), or custom scripts in `package.json` like `npm run generate` for boilerplate components in `src/`.
- **Local dev loops**: Use `npm start` for hot-reloading in development (watches `src/` changes). Add Nodemon for server-side if applicable: `npm install --save-dev nodemon`, then `npm run dev`.

## IDE / Editor Setup
- **VS Code Extensions**:
  - ESLint (by Microsoft): Integrates linting directly in the editor.
  - Prettier - Code formatter: Auto-formats on save.
  - GitLens: Enhances Git integration for blame and history.
  - React/JS-specific: ES7+ React/Redux/React-Native snippets for faster coding.
- **Workspace Settings**: Share `.vscode/settings.json` with Prettier as default formatter and ESLint auto-fix on save. Enable format-on-save in settings: `"editor.formatOnSave": true`.
- **Snippets/Templates**: Use built-in VS Code snippets for React components (e.g., type "rfc" for functional component). Custom snippets in `.vscode/my-snippets.code-snippets` for common patterns like test files in `tests/`.

## Productivity Tips
- **Terminal Aliases**: Add to `~/.bashrc` or `~/.zshrc`: `alias gs="git status"`, `alias gp="git pull"`, `alias start="npm start"`. For container workflows, use Docker if emulating production: `docker-compose up` from root (if `docker-compose.yml` exists).
- **Local Emulators**: Mirror production with `npm run build` followed by `serve -s build` (install serve globally: `npm i -g serve`). For sprint-based development, switch branches like `git checkout sprint3` to isolate features in `sprint2/` or `sprint3/` directories.
- **Shared Scripts/Dotfiles**: Link to `package.json` for all npm scripts (e.g., `test`, `build`). Team dotfiles in a shared repo or `SAVES/` folder for consistent setups. Use `npm run ci` for clean installs in CI-like local runs.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Verify commands align with the latest scripts and build tooling.
2. Remove instructions for deprecated tools and add replacements.
3. Highlight automation that saves time during reviews or releases.
4. Cross-link to runbooks or README sections that provide deeper context.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Onboarding docs, internal wikis, and team retrospectives.
- Script directories, package manifests, CI configuration.
- Maintainer recommendations gathered during pairing or code reviews.

<!-- agent-update:end -->
