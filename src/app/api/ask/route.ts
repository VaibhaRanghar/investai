import { NextRequest } from "next/server";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StockPriceTool } from "@/app/lib/tools/stockPriceTool";
import {
  AgentExecutor,
  createReactAgent,
  createToolCallingAgent,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { ChatOllama } from "@langchain/ollama";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  console.info("\nQuery: ", query);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are InvestAI, a smart investment assistant for Indian retail investors.
    
    **Rules**:
    - Always convert company names to correct stock symbols BEFORE calling get_stock_price.
    - Only provide stock symbols that are valid for Alpha Vantage API.
    - Don't use [Stock Symbol].NS for fetching details of stocks in stock price tool.
    - Common mappings:
        • "Reliance" → "RELIANCE"
        • "Tata Motors" → "TATAMOTORS"
        • "HCL" or "HCL Tech" → "HCLTECH"
        • "Infosys" → "INFY"
        • "ICICI Bank" → "ICICIBANK"
    - NEVER call the tool with ambiguous names like "HCL" — always resolve to a valid symbol first.
    - After getting the price, give a clear, friendly answer in ₹.`,
    ],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);
  const tools = [StockPriceTool];
  const model = new ChatOllama({
    model: "llama3.2:3b",
    temperature: 0,
    baseUrl: "http://localhost:11434",
  });
  console.info("\nModels and tools loaded");

  const agent = createToolCallingAgent({ llm: model, tools, prompt });
  const agent_executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    returnIntermediateSteps: true,
  });

  console.info("\nExecutor loaded");

  const result = await agent_executor.invoke({ input: query });
  const ans = result?.tool_calls;
  console.info("\nAnswer: ", result);
  console.info("\nResult: ", result.intermediateSteps[0].observation);

  return Response.json({
    answer: result.output, // ← This is the final AI response
    intermediateSteps: result.intermediateSteps, // optional for debugging
  });
}
