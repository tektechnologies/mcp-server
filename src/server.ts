import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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


server.tool("create-user", "Create a new user in the database", {
  name: z.string(),
  email: z.string(),
  address: z.string(), 
  phone: z.string()
}, {
  title: "Create User",
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
} async () => {
  console.log("Creating user");
  return {
    success: true,
    message: "User created successfully"
  }
}
})

async function main() {
  console.log("Server is running");
  const transport = new StdioServerTransport();
  await server.connect(transport);

}

main();