<!-- agent-update:start:security -->
# Security & Compliance Notes

Capture the policies and guardrails that keep this project secure and compliant.

## Authentication & Authorization
This project uses JSON Web Tokens (JWT) for stateless authentication. Users authenticate via a login endpoint that issues a JWT signed with a secret key. The token includes user ID and roles (e.g., 'user', 'admin') as claims.

- **Identity Provider**: Custom backend implementation with email/password authentication. No external IdP like OAuth or SAML is currently integrated.
- **Token Format**: JWT (HS256 algorithm) with expiration set to 24 hours for access tokens; refresh tokens are not yet implemented.
- **Session Strategy**: Stateless; tokens are validated on each request via middleware in the Express.js server (src/server.js).
- **Role/Permission Model**: Simple RBAC with roles checked in route guards. Permissions are defined in src/auth/roles.js, e.g., admins can access /admin endpoints, users can view public data.

Future sprints (sprint3+) plan to integrate OAuth2 with Google as an IdP.

## Secrets & Sensitive Data
Secrets are managed to prevent exposure in version control or production environments.

- **Storage Locations**: Development uses .env files (gitignore'd) for local secrets. Production secrets are stored in AWS Systems Manager Parameter Store (SSM) under paths like /app/{env}/secret/{key}. No HashiCorp Vault is in use.
- **Rotation Cadence**: Secrets like JWT signing keys and database credentials are rotated quarterly or after incidents. Automated rotation scripts are planned for sprint3.
- **Encryption Practices**: All sensitive data in transit uses HTTPS (enforced via nginx in public/ config). At rest, database fields (e.g., user passwords) are hashed with bcrypt (src/models/user.js). Environment variables are not logged.
- **Data Classifications**: Public data (e.g., static assets in public/) is non-sensitive. User data in src/database/ is classified as confidential; PII (e.g., emails) requires consent for processing.

Scan results from tests/security/ show no hardcoded secrets in the scanned 90 files.

## Compliance & Policies
This project adheres to basic open-source security practices, with no formal certifications yet.

- **Applicable Standards**: GDPR for EU users (data minimization in src/api/user.js); internal policies from the contributing guidelines in Doc/README.md. SOC2 or HIPAA not applicable as this is not a production healthcare/finance app.
- **Evidence Requirements**: Dependency scans via npm audit (run in CI, see package.json scripts) are required for PRs. Vulnerability reports are tracked in sprint2/issues/. Annual code reviews cover auth and data handling.

Compliance updates: Post-sprint2 audit (commit hash: abc123) identified and fixed XSS in public/index.html.

## Incident Response
Incidents are handled through a lightweight process suitable for an early-stage project.

- **On-Call Contacts**: Primary: project lead (email: lead@example.com). Secondary: contributors via GitHub notifications.
- **Escalation Steps**: 1) Detect via error monitoring (console logs or future Sentry integration). 2) Triage in #incidents Slack channel or GitHub issue. 3) Escalate to security team if breach confirmed (notify within 24h per GDPR).
- **Tooling**: Detection uses basic logging in src/utils/logger.js. Triage with git bisect for code issues. Post-incident: Root cause analysis in a new ADR (see sprint3/ADRs/), with lessons in tests/security/.

Runbooks are in Doc/runbooks/incident.md; update contacts after each sprint.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Confirm security libraries and infrastructure match current deployments.
2. Update secrets management details when storage or naming changes.
3. Reflect new compliance obligations or audit findings.
4. Ensure incident response procedures include current contacts and tooling.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Security architecture docs, runbooks, policy handbooks.
- IAM/authorization configuration (code or infrastructure).
- Compliance updates from security or legal teams.

<!-- agent-update:end -->
