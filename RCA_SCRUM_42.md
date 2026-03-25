# RCA Report: SCRUM-42
## Title: RCA - Misaligned Chat Widget Blocking 'Sign In' Button on Mobile

**Description**:
On mobile screen resolutions (< 480px), the Drift/support chat widget would overlay exactly on top of the "Sign In" button, preventing login.

**Detection**:
A sudden drop in mobile login conversions reported by the Product team on 2026-03-24 at 16:00 UTC.

**What went Wrong**:
A global CSS change to the support widget added a new `z-index` and changed its floating position from the bottom-left to the bottom-right for the latest campaign. It was not tested on small viewport widths.

**Correction**:
Manually updated the widget's media queries to shift it to a fixed bottom-center on screen widths below 480px.

**Prevention**:
Added mobile cross-browser visual snapshot testing for the login page specifically during the release pipeline.

**Impact**:
~20% loss in mobile login conversions for 3 hours.

**Timeline**:
- 16:00: Conversion drop alert by PM.
- 16:30: Visual audit on mobile confirmed widget overlay.
- 17:30: CSS fix deployed and verified.

**Action Item**:
Extend snapshot coverage to all mobile viewports. ETA: 2026-03-31.
