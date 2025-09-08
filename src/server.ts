import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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

async function main() {
  console.log("Server is running");
  const transport = new StdioServerTransport();
  await server.connect(transport);

}

main();