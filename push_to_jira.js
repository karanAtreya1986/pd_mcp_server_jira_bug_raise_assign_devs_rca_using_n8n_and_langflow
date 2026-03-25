import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const JIRA_URL = process.env.JIRA_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const PROJECT_KEY = 'SCRUM'; // Corrected project key as discovered

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

async function createBugs() {
  const bugs = JSON.parse(fs.readFileSync('./bugs.json', 'utf8'));

  for (const bug of bugs) {
    console.log(`Creating bug: ${bug.title}...`);
    try {
      const payload = {
        fields: {
          project: { key: PROJECT_KEY },
          summary: `[${bug.type}] ${bug.title}`,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: `Priority: ${bug.priority}\nSteps:\n${bug.steps.join('\n')}\n` }]
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: `Expected: ${bug.expected}\nActual: ${bug.actual}\n` }]
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: `Assignee: ${bug.assignee}` }]
              }
            ]
          },
          issuetype: { name: "Bug" },
          priority: { name: bug.priority === 'Critical' ? 'Highest' : (bug.priority === 'High' ? 'High' : (bug.priority === 'Medium' ? 'Medium' : 'Low')) }
        }
      };

      const response = await jiraClient.post('/issue', payload);
      console.log(`Successfully created issue: ${response.data.key}`);
    } catch (error) {
      console.error(`Error creating ${bug.title}:`, error.response?.data?.errors || error.message);
    }
  }
}

createBugs();
