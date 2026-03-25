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

async function findProject() {
  try {
    const response = await jiraClient.get('/project');
    console.log('PROJECTS:', response.data.map(p => p.key).join(', '));
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
  }
}

findProject();
