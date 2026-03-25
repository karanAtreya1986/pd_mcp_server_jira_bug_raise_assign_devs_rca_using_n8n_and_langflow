# Conversation Log - Jira MCP Practice Project

**Date**: 2026-03-24
**Project**: c:\Users\karan\Desktop\mcps-jira-practice

## Summary of Work Done

### 1. Jira MCP Server Setup
- Initialized a Node.js project with `@modelcontextprotocol/sdk`, `axios`, and `dotenv`.
- Created an MCP server (`index.js`) providing tools: `get_issue`, `create_issue`, and `search_issues`.
- Set up ES modules support and a start script in `package.json`.

### 2. Developer Team Assignment
- Generated a random list of 5 developers with mixed roles:
  - **Maya Lin**: Frontend Developer
  - **Rajesh Kumar**: Backend Developer
  - **Sarah Chen**: Full Stack Developer
  - **Kevin O'Connor**: Frontend Developer
  - **Anita Desai**: Backend Developer
- Stored details in `developers.json`.

### 3. Bug Identification & Reporting (app.vwo.com)
- Identified 5 specific bugs for the VWO login page:
  - 3 API issues (500 error, MFA timeout, missing status in payload).
  - 2 UI issues (forgot password link overlap, missing eye icon in Safari).
- Generated mock screenshots for UI issues.
- Stored locally in `bugs.json`, `bugs_report.md`, and `jira_links.md`.

### 4. Jira Syncing
- Discovered active Jira project key: `SCRUM`.
- Renamed credentials template to `.env`.
- Created and executed `push_to_jira.js` to create all 5 tickets:
  - **SCRUM-33** to **SCRUM-37**.
- Added direct Jira links to the local documentation.

### 5. Stakeholder & Analytics Reports
- Installed `xlsx` library.
- Created `generate_reports.js` to build:
  - **bug_report.xlsx**: Structured spreadsheet for data analysts.
  - **stakeholder_report.html**: Premium, visual report for management.
- Added **Developer Role** column to both reports as requested.

## Project File Manifest
- `index.js`: Jira MCP Server.
- `push_to_jira.js`: Script to sync local bugs to Jira.
- `generate_reports.js`: Script to build Excel/HTML reports.
- `bug_report.xlsx`: Excel tracker.
- `stakeholder_report.html`: Visual report.
- `bugs_report.md`: Markdown summary with Jira links.
- `jira_links.md`: Quick links to Jira tickets.
- `vwo_login_mobile_overlap_bug.png`: Bug screenshot.
- `vwo_login_eye_icon_missing_bug.png`: Bug screenshot.
- `conversation.md`: This summary log.
