"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const promises_1 = __importDefault(require("node:fs/promises"));
const server = new mcp_js_1.McpServer({
    name: 'mcp-server-and-client',
    version: '2.0.0',
    description: 'A MCP server and client',
    capabilities: {
        tools: {},
        resources: {},
        prompts: {},
    },
});
server.tool('create-user', 'Create a new user in the database', {
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    address: zod_1.z.string(),
    phone: zod_1.z.string(),
}, {
    title: 'Create User',
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
}, async (params) => {
    console.log(params);
    try {
        const id = await createUser(params);
        return {
            content: [
                {
                    type: 'text',
                    text: `User ${id} created successfully`
                }
            ],
        };
    }
    catch {
        return {
            content: [
                {
                    type: 'text',
                    text: 'User creation failed',
                },
            ],
        };
    }
});
async function createUser(user) {
    console.log('Creating user', user);
    const usersData = await promises_1.default.readFile('./src/data/users.json', 'utf-8');
    const users = JSON.parse(usersData);
    const id = users.length + 1;
    users.push({
        id,
        ...user,
    });
    await promises_1.default.writeFile('./src/data/users.json', JSON.stringify(users, null, 2));
    return id;
}
async function main() {
    console.log('Server is running');
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main();
