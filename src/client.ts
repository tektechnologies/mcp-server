import { Client } from "@modelcontextprotocol/sdk/client";





const mcp = new Client(
  {
    name: "text-client-video",
    version: "1.0.0",
  },
  { capabilities: {sampling: { } } }
)