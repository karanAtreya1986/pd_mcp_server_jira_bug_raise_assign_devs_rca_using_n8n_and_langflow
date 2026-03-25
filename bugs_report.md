# VWO.com Login Page - Bug Report

## Overview
This report documents 5 identified issues (3 API, 2 UI) during testing of the `app.vwo.com` login page.

| Bug ID | Title | Priority | Assignee | Type | Status | Link |
|---|---|---|---|---|---|---|
| BUG-API-001 | 500 Error on Special Characters in Email | High | Rajesh Kumar | API | Open | [SCRUM-33](https://karan1988.atlassian.net/browse/SCRUM-33) |
| BUG-API-002 | MFA Timeout (>10s) | Critical | Anita Desai | API | Open | [SCRUM-34](https://karan1988.atlassian.net/browse/SCRUM-34) |
| BUG-API-003 | Missing Status in Invalid Password Payload | Medium | Sarah Chen | Full Stack | Open | [SCRUM-35](https://karan1988.atlassian.net/browse/SCRUM-35) |
| BUG-UI-001 | Forgot Password Link Overlap (Mobile) | High | Maya Lin | UI | Open | [SCRUM-36](https://karan1988.atlassian.net/browse/SCRUM-36) |
| BUG-UI-002 | Missing Eyes Icon (Safari Password masked) | Medium | Kevin O'Connor | UI | Open | [SCRUM-37](https://karan1988.atlassian.net/browse/SCRUM-37) |

---

### [BUG-API-001] 500 Internal Server Error on Special Characters in Email
**Priority**: High
**Assignee**: Rajesh Kumar (Backend)
**Summary**: Sending an email address with certain special characters (e.g., `test'OR'1=1@vwo.com`) results in a server-side crash.
**Steps to Reproduce**:
1. Go to `app.vwo.com`.
2. Enter `test'OR'1=1@vwo.com` in the email field.
3. Observe the response from `/check-user` API.
**Expected Result**: Validation error or user not found (404/200 with false).
**Actual Result**: 500 Internal Server Error.

### [BUG-API-002] Timeout in MFA Validation Endpoint
**Priority**: Critical
**Assignee**: Anita Desai (Backend)
**Summary**: The MFA authentication code check takes more than 10 seconds to respond, causing the client to time out.
**Steps to Reproduce**:
1. Correct credentials entered.
2. Enter MFA code.
3. Observe time taken by `/mfa/verify`.
**Expected Result**: Less than 3s response time.
**Actual Result**: Consistent timeouts (>10s).

### [BUG-API-003] Missing `status` in Invalid Password Response
**Priority**: Medium
**Assignee**: Sarah Chen (Full Stack)
**Summary**: The API response for a 401 Unauthorized is missing the standard `status` property in JSON.
**Steps to Reproduce**:
1. Enter correct email, wrong password.
2. Observe the JSON response from `/login`.
**Expected Result**: Payload should contain `"status": "error"`.
**Actual Result**: Payload only contains `{"code": 401, "msg": "Invalid password"}`.

### [BUG-UI-001] Forgot Password Link Overlapping Login Button (Mobile)
**Priority**: High
**Assignee**: Maya Lin (Frontend)
**Summary**: On iPhone and Android screens, the "Forgot Password" link overlaps with the "Login" button.
**Steps to Reproduce**:
1. Open `app.vwo.com` on a mobile browser or emulator (width < 380px).
2. Scroll to the login section.
**Actual Result**: Link is physically underneath/behind the button.
**Screenshot**: Refer to `vwo_login_mobile_overlap_bug.png` in project root.

### [BUG-UI-002] Eye Icon Missing for Password Toggle in Safari
**Priority**: Medium
**Assignee**: Kevin O'Connor (Frontend)
**Summary**: The eye icon (toggle password visibility) is not rendered correctly in Safari browsers version < 17.
**Steps to Reproduce**:
1. Open `app.vwo.com` in Safari.
2. Look at the password input field.
**Actual Result**: The interactive icon is missing, preventing users from seeing their password.
**Screenshot**: Refer to `vwo_login_eye_icon_missing_bug.png` in project root.
