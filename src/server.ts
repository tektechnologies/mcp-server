import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import { mime } from "zod/v4";
import { error } from "node:console";

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

server.resource(
  "users",
  "users://all",
  {
    description: "Get all users data from the database",
    title: "Users",
    mimeType: "application/json",
  },
  async (uri) => {
    const users = await import("./data/users.json", {
      assert: { type: "json" },
    }).then((m) => m.default);
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(users),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.resource(
  "user-details",
  new ResourceTemplate("users://userId}/profile", {
    list: undefined,
  }),
  {
    description: "Get user details from the database",
    title: "User Details",
    mimeType: "application/json",
  },
  async (uri, { userId }) => {
    const users = await import("./data/users.json", {
      assert: { type: "json" },
    }).then((m) => m.default);

    const user = users.find((u) => u.id === parseInt(userId as string));

    if (user == null) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: "User not found" }),
            mimeType: "application/json",
          },
        ],
      };
    }
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({ error: "User not found" }),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.tool(
  "create-user",
  "Create a new user in the database",
  {
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
  },
  {
    title: "Create User",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (params) => {
    console.log(params);
    try {
      const id = await createUser(params);

      return {
        content: [
          {
            type: "text",
            text: `User ${id} created successfully`,
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: "text",
            text: "User creation failed",
          },
        ],
      };
    }
  }
);

async function createUser(user: {
  name: string;
  email: string;
  address: string;
  phone: string;
}) {
  console.log("Creating user", user);

  const usersData = await fs.readFile("./src/data/users.json", "utf-8");
  const users = JSON.parse(usersData);

  const id = users.length + 1;

  users.push({
    id,
    ...user,
  });

  await fs.writeFile("./src/data/users.json", JSON.stringify(users, null, 2));

  return id;
}

async function main() {
  console.log("Server is running");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
