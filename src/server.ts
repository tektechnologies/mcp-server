import { McpServer } from "@modelcontextprotocol/sdk";

const server = new McpServer({
    name: "mcp-server-and-client",
    version: "2.0.0",
    description: "A MCP server and client",
});

server.tool({
    name: "mcp-server-and-client",
});