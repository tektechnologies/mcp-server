# mcp-server

This project implements a Model Context Protocol (MCP) server and client in TypeScript.

## Features

- MCP server with stdio transport
- Tool: `create-user` — create a new user in the database ([src/data/users.json](src/data/users.json))
- User data stored in JSON format
- Uses [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) and [zod](https://github.com/colinhacks/zod) for validation

## Getting Started

### Install dependencies

```sh
npm install
```

### Build the server

```sh
npm run server:build
```

### Run the server (development)

```sh
npm run server:dev
```

### MCP Inspector (optional)

```sh
npm run server:inspect
```

## Project Structure

- `src/server.ts` — MCP server implementation
- `src/client.ts` — MCP client (template)
- `src/data/users.json` — User database
- `build/` — Compiled JavaScript output

## Tool: create-user

Creates a new user with the following fields:

- `name`
- `email`
- `address`
- `phone`

## License

ISC