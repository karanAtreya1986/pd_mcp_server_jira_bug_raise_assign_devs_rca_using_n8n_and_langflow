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

async function findUsers() {
  try {
    const developers = ["Maya Lin", "Rajesh Kumar", "Sarah Chen", "Kevin O'Connor", "Anita Desai"];
    const results = {};

    for (const dev of developers) {
      console.log(`Searching for ${dev}...`);
      const response = await jiraClient.get('/user/search', {
        params: { query: dev }
      });
      if (response.data.length > 0) {
        results[dev] = response.data[0].accountId;
      } else {
        results[dev] = 'NOT_FOUND';
      }
    }
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

findUsers();
