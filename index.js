import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JIRA_URL = process.env.JIRA_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;

if (!JIRA_URL || !JIRA_API_TOKEN || !JIRA_EMAIL) {
  console.error("Missing environment variables: JIRA_URL, JIRA_API_TOKEN, or JIRA_EMAIL");
  process.exit(1);
}

const jiraClient = axios.create({
  baseURL: `${JIRA_URL}/rest/api/3`,
  headers: {
    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const server = new Server(
  {
    name: "jira-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_issue",
        description: "Get details of a Jira issue by key",
        inputSchema: {
          type: "object",
          properties: {
            issueKey: { type: "string", description: "Jira issue key (e.g., PROJ-123)" },
          },
          required: ["issueKey"],
        },
      },
      {
        name: "create_issue",
        description: "Create a new Jira issue",
        inputSchema: {
          type: "object",
          properties: {
            projectKey: { type: "string", description: "Project key (e.g., PROJ)" },
            summary: { type: "string", description: "Issue summary/title" },
            description: { type: "string", description: "Issue description" },
            issueType: { type: "string", description: "Issue type (e.g., Task, Bug, Story)", default: "Task" },
          },
          required: ["projectKey", "summary"],
        },
      },
      {
        name: "search_issues",
        description: "Search issues using JQL",
        inputSchema: {
          type: "object",
          properties: {
            jql: { type: "string", description: "JIRA Query Language string" },
            maxResults: { type: "number", default: 50 },
          },
          required: ["jql"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_issue": {
        const response = await jiraClient.get(`/issue/${args.issueKey}`);
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      }
      case "create_issue": {
        const payload = {
          fields: {
            project: { key: args.projectKey },
            summary: args.summary,
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: args.description || "" }],
                },
              ],
            },
            issuetype: { name: args.issueType || "Task" },
          },
        };
        const response = await jiraClient.post("/issue", payload);
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      }
      case "search_issues": {
        const response = await jiraClient.post("/search", {
          jql: args.jql,
          maxResults: args.maxResults,
        });
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      }
      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (error) {
    const message = error.response?.data?.errorMessages?.[0] || error.message;
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Jira MCP Server running on stdio");
}

main().catch(console.error);
