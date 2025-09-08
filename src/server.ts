import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
    name: "mcp-server-and-client",
    version: "2.0.0",
    description: "A MCP server and client",
    capabilities: {
        tools: {},
        resources: {},
        prompts: {},
    },
});

