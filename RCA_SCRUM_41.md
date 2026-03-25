# RCA Report: SCRUM-41
## Title: RCA - VWO Logo Asset Failing to Load via CloudFront CDN

**Description**:
The VWO logo on the login page was randomly missing for users accessing it from the US-West-1 region, resulting in a blank header area.

**Detection**:
Detected via automatic visual regression tests on 2026-03-24 at 09:00 UTC.

**What went Wrong**:
CloudFront CDN cache was not invalidated properly during the last asset deployment. Some edge locations were serving a zero-byte cached version of the `logo.svg` file.

**Correction**:
Manually triggered a global CloudFront invalidation for all assets in the `/static/images/` directory. Verified accessibility on multiple edge nodes.

**Prevention**:
Updated the automation pipeline to include an invalidation check at the end of each build deploy.

**Impact**:
Visual inconsistency for users. Approximately 15% of the global traffic was affected.

**Timeline**:
- 09:00: Visual regression alert.
- 09:30: CDN cache confirmed empty for US-West.
- 10:15: Invalidation triggered globally.
- 11:00: Resolved.

**Action Item**:
Audit CloudFront cache settings for long-term reliability. ETA: 2026-03-31.
