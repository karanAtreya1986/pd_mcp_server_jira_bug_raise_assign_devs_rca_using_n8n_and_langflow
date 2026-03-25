# RCA Report: SCRUM-39
## Title: RCA - Rate Limiting Header (429) Triggering Prematurely

**Description**:
Users from specific enterprises were experiencing 429 Too Many Requests errors while interacting with the API at low usage levels. This occurred because our rate limiting bucket was tied to the IP address rather than the API Key.

**Detection**:
Detected by the Customer Support team on 2026-03-24 at 15:30 UTC following complaints from multiple users in the same corporate network.

**What went Wrong**:
The rate limiting logic used a raw IP key to track request counts. Large corporate networks with centralized NAT caused their usage to be aggregated into a single IP bucket, triggering an early limit.

**Correction**:
Updated the rate limiter to use a composite key of `IP + API_KEY`. Hotfix applied to production on 2026-03-24 at 18:00 UTC.

**Prevention**:
Updated the API Architecture documentation to require key-based rate limiting as a default. Added a test scenario for shared IP access in staging.

**Impact**:
3 high-value enterprise customers were unable to access automation features for 2.5 hours.

**Timeline**:
- 15:30: Reported by support.
- 16:00: Logs analyzed; IP collision confirmed.
- 17:00: Logic change deployed to testing.
- 18:00: Production deployment finished.

**Action Item**:
Extend key-based rate limiting to all non-public APIs. ETA: 2026-03-28.
