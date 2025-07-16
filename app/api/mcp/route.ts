// app/api/mcp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/utils/client/index.js";
import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  Schema,
  Type,
} from "@google/genai";
import { redis } from "../../../utils/redis.client";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY! });
const MAX_HISTORY = 50; // trim to last 50 turns

export async function POST(req: NextRequest) {
  const { sessionId, message } = await req.json();
  const userMessage = message?.trim() || "Hello, how can I help?";

  const key = `chat:${sessionId}`;

  // Push user message into Redis list

  await redis.rPush(key, JSON.stringify({ role: "user", text: userMessage }));
  await redis.lTrim(key, -MAX_HISTORY, -1);

  // Retrieve current conversation history
  const rawHistory = await redis.lRange(key, 0, -1);
  const history = Array.isArray(rawHistory)
    ? rawHistory
        .filter((item): item is string => typeof item === "string")
        .map((item) => JSON.parse(item))
    : [];

  // Prepare tool definitions
  const toolDefs = (await client.listTools()).tools;
  const fnDeclarations = toolDefs.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: {
      type: Type.OBJECT,
      properties: t.inputSchema.properties as Record<string, Schema>,
      required: t.inputSchema.required,
    },
  }));

  // Build AI input with history
  const contents = history.map((turn: { role: any; text: any }) => ({
    role: turn.role as any,
    parts: [{ text: turn.text }],
  }));

  // Call the AI
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
    config: {
      toolConfig: {
        functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO },
      },
      tools: [{ functionDeclarations: fnDeclarations }],
    },
  });
  console.log(response.functionCalls);

  // Handle function calls (tools)
  if (response.functionCalls?.length) {
    const { name, args } = response.functionCalls[0] as any;
    const toolResponse = await client.callTool({ name, arguments: args });
    let parsed;
    try {
      parsed = JSON.parse(
        (toolResponse.content as Array<{ text: string }> | undefined)?.[0]
          ?.text || "null"
      );
    } catch {
      parsed = toolResponse;
    }

    // Record tool output as assistant message
    const toolText = JSON.stringify(parsed);
    await redis.rPush(
      key,
      JSON.stringify({ role: "assistant", text: toolText })
    );
    await redis.lTrim(key, -MAX_HISTORY, -1);

    return NextResponse.json({ fromTool: true, data: parsed });
  }

  // Regular assistant reply
  console.log("this is response", response.text);
  const aiText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  await redis.rPush(key, JSON.stringify({ role: "assistant", text: aiText }));
  await redis.lTrim(key, -MAX_HISTORY, -1);

  return NextResponse.json({ fromTool: false, response: aiText });
}
