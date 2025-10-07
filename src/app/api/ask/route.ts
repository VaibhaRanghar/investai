/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StockPriceTool } from "@/app/lib/tools/stockPriceTool";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";

// Simple rate limiting (in-memory)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Get user IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return Response.json(
        {
          answer:
            "⏱️ Rate limit exceeded. Please wait a minute before trying again.",
          success: false,
          error: "RATE_LIMIT",
        },
        { status: 429 }
      );
    }

    const { query } = await req.json();

    // Validate input
    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return Response.json(
        {
          answer: "Please provide a valid stock query (at least 3 characters).",
          success: false,
          error: "INVALID_INPUT",
        },
        { status: 400 }
      );
    }

    console.info("\n🔍 Query:", query);

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are InvestAI, a smart investment assistant for Indian retail investors.
    
**Rules**:
- Always convert company names to correct NSE stock symbols BEFORE calling get_stock_price.
- Common Indian stock symbol mappings:
    • "Reliance" or "Reliance Industries" → "RELIANCE"
    • "Tata Motors" → "TATAMOTORS"
    • "HCL" or "HCL Tech" or "HCL Technologies" → "HCLTECH"
    • "Infosys" → "INFY"
    • "TCS" or "Tata Consultancy" → "TCS"
    • "ICICI Bank" → "ICICIBANK"
    • "HDFC Bank" → "HDFCBANK"
    • "Wipro" → "WIPRO"
    • "ITC" → "ITC"
    • "Bharti Airtel" or "Airtel" → "BHARTIARTL"
- NEVER use .NS or .BO suffix when calling the tool - it's added automatically.
- If user asks about a company name, convert it to the stock symbol first.
- After getting the price data, provide a clear, conversational response in the form of string with proper formatting.
- Don't answer like this "Please note that the actual data may vary based on the current market conditions."
- If the tool returns an error, explain it in simple terms and suggest what to try.`,
      ],
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const tools = [StockPriceTool];
    let model;
    if (process.env.NODE_ENV === "development") {
      model = new ChatOllama({
        model: "llama3.2:3b",
        temperature: 0,
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      });
    } else {
      model = new ChatGroq({
        model: "llama-3.3-70b-versatile", 
        temperature: 0,
        apiKey: process.env.GROQ_API_KEY,
      });
    }

    console.info("✅ Models and tools loaded.\nModel = ", model);

    const agent = createToolCallingAgent({ llm: model, tools, prompt });

    const agent_executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      returnIntermediateSteps: true,
      maxIterations: 3, 
      earlyStoppingMethod: "force",
    });

    console.info("✅ Executor loaded");

    const result = await agent_executor.invoke({ input: query });

    console.info("✅ Result:", result.output);

    return Response.json({
      answer: result.output,
      intermediateSteps: result.intermediateSteps,
      success: true,
    });
  } catch (error: any) {
    console.error("❌ Agent execution error:", error);

    return Response.json(
      {
        answer:
          "Sorry, I encountered an error processing your request. Please try again or rephrase your question.",
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
