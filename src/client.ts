import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";





const mcp = new Client(
  {
    name: "text-client-video",
    version: "1.0.0",
  },
  { capabilities: {sampling: { } } }
)

const transport = new StdioClientTransport({
  command: "node",
  args: ["build/server.js"],
  stderr: "ignore",
})

async function main() {

  await mcp.connect(transport)
  Promise.all([
   mcp.listTools(),
   mcp.listPrompts(),
   mcp.listResources(),
   mcp.listResourceTemplates()
  ])
  const { tools } = await mcp.listTools()
  

}

main()