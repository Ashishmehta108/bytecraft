import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
let client: Client | undefined = undefined;

const baseUrl = new URL("http://localhost:3001/sse");

client = new Client({
  name: "sse-client",
  version: "1.0.0",
});

const sseTransport = new SSEClientTransport(baseUrl);

await client.connect(sseTransport);
const tools = await (await client.listTools()).tools;
console.log(tools);
console.log("Connected using SSE transport");

export { client };
