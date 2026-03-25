# RCA Report: SCRUM-40
## Title: RCA - Verbose Stack Trace Leak in /login-status Endpoint

**Description**:
The API response for a 500 error on the `/login-status` endpoint was exposing internal server stack traces, including DB query logic and library versions.

**Detection**:
Security audit using automated scanning tools on 2026-03-24 at 10:00 UTC. Reported by the internal SecOps team.

**What went Wrong**:
The Node.js environment variable `NODE_ENV` was set to `development` instead of `production` on the worker cluster. Default error handlers in Express then leaked the full stack trace to the client.

**Correction**:
Manually overridden the `NODE_ENV` settings on the production clusters and added a central error handler to generic sanitize responses.

**Prevention**:
Integrated a CI check to ensure all production deployment manifests explicitly set `NODE_ENV=production`. Added a safeguard in the middleware to never leak stack traces if the environment is not `dev`.

**Impact**:
Minor vulnerability risk - internal structure exposed to public. No direct data breach.

**Timeline**:
- 10:00: Vulnerability detected during scan.
- 11:00: Fixed the server-side environment variables.
- 12:30: Added a global error-sanitizer middleware to the gateway.

**Action Item**:
Audit all microservices for the `NODE_ENV` flag consistency. ETA: 2026-03-27.
