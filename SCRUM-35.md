# Bug Report: SCRUM-35
## Title: Missing 'status' Property in Invalid Password JSON Response

**Priority**: Medium
**Assignee**: Sarah Chen
**Type**: API
**Link**: [SCRUM-35](https://karan1988.atlassian.net/browse/SCRUM-35)

### Steps to Reproduce
1. Enter wrong credentials
2. Analyze network intercept

### Expected Result
JSON should contain { status: 'error' }.

### Actual Result
JSON missing 'status' field.
