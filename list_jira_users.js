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

async function listUsers() {
  try {
    const response = await jiraClient.get('/users/search');
    console.log(JSON.stringify(response.data.map(u => ({
      displayName: u.displayName,
      accountId: u.accountId,
      accountType: u.accountType
    })), null, 2));
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

listUsers();
