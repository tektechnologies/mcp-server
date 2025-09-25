import "dotenv/config";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { confirm, input, select } from "@inquirer/prompts";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  CreateMessageRequestSchema,
  Prompt,
  PromptMessage,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { generateText, jsonSchema, ToolSet } from "ai";

const mcp = new Client(
  {
    name: "text-client-video",
    version: "1.0.0",
  },
  { capabilities: { sampling: {} } }
);

const transport = new StdioClientTransport({
  command: "node",
  args: ["build/server.js"],
  stderr: "ignore",
});

async function main() {
  await mcp.connect(transport);

  const [{ tools }, { prompts }, { resources }, { resourceTemplates }] =
    await Promise.all([
      mcp.listTools(),
      mcp.listPrompts(),
      mcp.listResources(),
      mcp.listResourceTemplates(),
    ]);
  console.log("You are connected to the client!");

  while (true) {
    const option = await select({
      message: "what would you like to do",
      choices: ["Query", "Tools", "Resources", "Prompts"],
    });
    switch (option) {
      case "Tools":
        const toolName = await select({
          message: "Select a tool",
          choices: tools.map((tool) => ({
            name: tool.annotations?.title || tool.name,
            value: tool.name,
            description: tool.description,
          })),
        });
        const tool = tools.find((t) => t.name === toolName);
        if (tool == null) {
          console.error("Tool not found.");
        } else {
          await handleTool(tool);
        }
        break;
      case "Resources":
        const resourceUri = await select({
          message: "Select a resource",
          choices: [
            ...resources.map((resource) => ({
              name: resource.name,
              value: resource.uri,
              description: resource.description,
            })),
            ...resourceTemplates.map((template) => ({
              name: template.name,
              value: template.uriTemplate,
              description: template.description,
            })),
          ],
        });
        const uri =
          resources.find((r) => r.uri === resourceUri)?.uri ??
          resourceTemplates.find((r) => r.uriTemplate === resourceUri)
            ?.uriTemplate;
        if (uri == null) {
          console.error("Resource not found.");
        } else {
          await handleResource(uri);
        }
        break;
      case "Prompts":
        const promptName = await select({
          message: "Select a prompt",
          choices: prompts.map((prompt) => ({
            name: prompt.name,
            value: prompt.name,
            description: prompt.description,
          })),
        });
        const prompt = prompts.find((p) => p.name === promptName);
        if (prompt == null) {
          console.error("Prompt not found.");
        } else {
          await handlePrompt(prompt);
        }
        break;
      case "Query":
        await handleQuery(tools);
        break;
    }
  }
}

// Handler functions
async function handleTool(tool: Tool) {
  console.log(`Using tool: ${tool.name}`);
  // Add tool execution logic here
  const args: Record<string, string> = {}
  for( const [key, value] of Object.entries(tool.inputSchema.properties ?? {}))
  {
    args[key] = await input({
      message: `Enter value for %{key} (${(value as {type: string }).type}):`,
    })
  }
  const res = await mcp.callTool({
    name: tool.name,
    arguments: args,
  })
  console.log((res.content as [{text: string }])[0].text)
}

async function handleResource(uri: string) {
  console.log(`Accessing resource: ${uri}`);
  // Add resource handling logic here
}

async function handlePrompt(prompt: Prompt) {
  console.log(`Using prompt: ${prompt.name}`);
  // Add prompt handling logic here
}

async function handleQuery(tools: Tool[]) {
  console.log("Query functionality");
  // Add query logic here
}

main();
