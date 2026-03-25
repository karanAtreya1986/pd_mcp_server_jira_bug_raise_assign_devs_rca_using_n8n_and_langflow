# Bug Report: SCRUM-33
## Title: 500 Internal Server Error (Login API) with Special Characters

**Priority**: High
**Assignee**: Rajesh Kumar
**Type**: API
**Link**: [SCRUM-33](https://karan1988.atlassian.net/browse/SCRUM-33)

### Steps to Reproduce
1. Navigate to app.vwo.com
2. Enter `test'OR'1=1@vwo.com` in email
3. Check server response

### Expected Result
400/404 or human error message.

### Actual Result
500 Internal Server Error (Stack trace visible).
