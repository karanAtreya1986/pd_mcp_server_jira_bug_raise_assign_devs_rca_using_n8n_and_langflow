import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const JIRA_URL = process.env.JIRA_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const PROJECT_KEY = 'SCRUM';

const jiraClient = axios.create({
  baseURL: `${JIRA_URL}/rest/api/3`,
  headers: {
    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const prodBugs = [
  {
    title: "RCA-API: Inconsistent JWT Token Expiry Resulting in Random 401s",
    priority: "Highest",
    type: "API",
    assignee: "Rajesh Kumar",
    summary: "Production users reported random 401 unauthorized errors despite having valid sessions. RCA suggests inconsistent token expiry logic across endpoints."
  },
  {
    title: "RCA-API: Rate Limiting Header (429) Triggering Prematurely",
    priority: "High",
    type: "API",
    assignee: "Anita Desai",
    summary: "Production rate limiting is blocking legitimate traffic from same-enterprise IP pools. RCA: IP-based bucket is too aggressive for high-volume customers."
  },
  {
    title: "RCA-API: Verbose Stack Trace Leak in /login-status Endpoint",
    priority: "High",
    type: "API",
    assignee: "Sarah Chen",
    summary: "Security audit found that internal server errors expose DB query structure in production. RCA: Development error handling was not disabled in the latest prod build."
  },
  {
    title: "RCA-UI: VWO Logo Asset Failing to Load via CloudFront CDN",
    priority: "Medium",
    type: "UI",
    assignee: "Maya Lin",
    summary: "Logo is missing for 15% of users. RCA: Cache invalidation failed during the last deployment of assets."
  },
  {
    title: "RCA-UI: Misaligned Chat Widget Blocking 'Sign In' Button on Mobile",
    priority: "High",
    type: "UI",
    assignee: "Kevin O'Connor",
    summary: "Mobile users on Android Chrome cannot tap the sign-in button. RCA: Updated z-index of the support widget."
  }
];

async function createProdBugs() {
  const links = [];
  for (const bug of prodBugs) {
    console.log(`Creating prod bug: ${bug.title}...`);
    try {
      const payload = {
        fields: {
          project: { key: PROJECT_KEY },
          summary: bug.title,
          description: {
            type: "doc",
            version: 1,
            content: [
              { type: "paragraph", content: [{ type: "text", text: `Type: ${bug.type}\nPriority: ${bug.priority}\n\nSummary: ${bug.summary}\nAssignee: ${bug.assignee}` }] }
            ]
          },
          issuetype: { name: "Bug" },
          priority: { name: bug.priority }
        }
      };

      const response = await jiraClient.post('/issue', payload);
      links.push(`- [${response.data.key}]: ${bug.title} (https://karan1988.atlassian.net/browse/${response.data.key})`);
      console.log(`Successfully created issue: ${response.data.key}`);
    } catch (error) {
      console.error(`Error creating ${bug.title}:`, error.response?.data?.errors || error.message);
    }
  }

  const linksContent = "# Production RCA Bug Links\n\nDirect links to production-related RCA tickets:\n\n" + links.join('\n');
  fs.writeFileSync('prod_jira_links.md', linksContent);
  console.log('Production links saved to prod_jira_links.md');
}

createProdBugs();
