import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';
import XLSX from 'xlsx';

dotenv.config();

const JIRA_URL = process.env.JIRA_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const PROJECT_KEY = 'SCRUM';

if (!JIRA_URL || !JIRA_API_TOKEN || !JIRA_EMAIL) {
  console.error("Please provide JIRA_URL, JIRA_API_TOKEN, and JIRA_EMAIL in your .env file.");
  process.exit(1);
}

const jiraClient = axios.create({
  baseURL: `${JIRA_URL}/rest/api/3`,
  headers: {
    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

async function exportAllBugs() {
  console.log(`Fetching all bugs from project ${PROJECT_KEY} using Enhanced Search API...`);
  let allBugs = [];
  let nextPageToken = null;
  let isLast = false;

  try {
    do {
      const params = {
        jql: `project = ${PROJECT_KEY}`,
        maxResults: 100,
        fields: 'summary,status,priority,assignee,created,updated,issuetype'
      };
      if (nextPageToken) {
        params.nextPageToken = nextPageToken;
      }

      const response = await jiraClient.get('/search/jql', { params });
      
      const { issues, nextPageToken: token, isLast: last } = response.data;
      
      if (issues.length > 0) {
        console.log("Example issue keys:", Object.keys(issues[0]));
        console.log("Example issue fields keys:", Object.keys(issues[0].fields || {}));
      }
      
      console.log(`Fetched ${issues.length} issues...`);
      
      // Filter for bugs
      const bugsOnPage = issues.filter(i => i.fields.issuetype.name === 'Bug');
      allBugs = allBugs.concat(bugsOnPage);

      nextPageToken = token;
      isLast = last;
      
      if (isLast || !nextPageToken) break;

    } while (true);

    console.log(`Total bugs found: ${allBugs.length}`);

    const data = allBugs.map(issue => ({
      "Key": issue.key,
      "Summary": issue.fields.summary,
      "Status": issue.fields.status.name,
      "Priority": issue.fields.priority?.name || 'N/A',
      "Assignee": issue.fields.assignee?.displayName || 'Unassigned',
      "Created": issue.fields.created,
      "Updated": issue.fields.updated,
      "Link": `${JIRA_URL}/browse/${issue.key}`
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Jira Bugs");
    
    // Save as XLSX
    const xlsxFilename = "all_jira_bugs_export.xlsx";
    XLSX.writeFile(wb, xlsxFilename);
    console.log(`Successfully exported to ${xlsxFilename}`);

    // Save as CSV
    const csvFilename = "all_jira_bugs_export.csv";
    console.log(`Converting worksheet to CSV...`);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    console.log(`Writing CSV to disk: ${csvFilename}... content size: ${csvContent.length} bytes`);
    fs.writeFileSync(csvFilename, csvContent);
    console.log(`Successfully exported to ${csvFilename}`);
  } catch (error) {
    if (error.response) {
      console.error("Error Response Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error Message:", error.message);
    }
  }
}

exportAllBugs();
