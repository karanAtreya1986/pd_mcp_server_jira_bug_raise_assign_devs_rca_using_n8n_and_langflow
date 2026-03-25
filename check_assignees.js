import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const JIRA_URL = process.env.JIRA_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;

const jiraClient = axios.create({
  baseURL: `${JIRA_URL}/rest/api/3`,
  headers: {
    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
    'Accept': 'application/json'
  }
});

async function check() {
  try {
    const keys = [
      'SCRUM-33', 'SCRUM-34', 'SCRUM-35', 'SCRUM-36', 'SCRUM-37',
      'SCRUM-38', 'SCRUM-39', 'SCRUM-40', 'SCRUM-41', 'SCRUM-42'
    ];
    const response = await jiraClient.get('/search/jql', {
      params: {
        jql: `key in (${keys.join(',')})`,
        fields: 'assignee,summary'
      }
    });

    console.log(JSON.stringify(response.data.issues.map(i => ({
      key: i.key,
      summary: i.fields.summary,
      assignee: i.fields.assignee?.displayName || 'Unassigned'
    })), null, 2));

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

check();
