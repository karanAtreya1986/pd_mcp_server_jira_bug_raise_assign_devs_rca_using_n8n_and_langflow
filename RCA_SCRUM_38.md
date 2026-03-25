# RCA Report: SCRUM-38
## Title: RCA - Inconsistent JWT Token Expiry Resulting in Random 401s

**Description**:
Users experienced periodic, non-reproducible session timeouts leading to 401 Unauthorized errors while navigating the dashboard. It was caused by a mismatch in TTL calculations between the authentication microservice and the API gateway.

**Detection**:
Detected by the Production Monitoring team (SRE) via New Relic alerts for high 401 error rate spikes on 2026-03-24 at 14:00 UTC.

**What went Wrong**:
The authentication service used a rounded Unix timestamp (seconds) for token generation, whereas the API Gateway used millisecond precision for validation checks. This created a 1-second race condition causing rejection of valid tokens.

**Correction**:
Synchronized TTL precision across all services to use millisecond timestamps. Fix deployed to production on 2026-03-24 at 16:30 UTC.

**Prevention**:
Updated standard Auth Library to enforce millisecond precision. Added integration tests to verify token expiry consistency across different clock precisions.

**Impact**:
Approximately 2.5% of total active users (about 450 enterprise accounts) were affected by session drops.

**Timeline**:
- 14:00: Monitoring alerts triggered.
- 14:15: Root cause identified in gateway logs.
- 15:00: Patch developed and staged.
- 16:30: Production deployment complete.

**Action Item**:
1. Update Auth SDK globally. ETA: 2026-04-01.
2. Add clock-drift simulation to load tests. ETA: 2026-03-30.
