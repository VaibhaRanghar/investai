// /* eslint-disable @typescript-eslint/no-explicit-any */
// // app/api/ask/route.ts
// import { NextRequest } from "next/server";
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
// } from "@langchain/core/prompts";
// import { StockPriceTool } from "@/app/lib/tools/stockPriceTool";
// import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
// import { ChatOllama } from "@langchain/ollama";
// import { ChatGroq } from "@langchain/groq";
// import {
//   checkRateLimit,
//   getClientIP,
//   createRateLimitResponse,
//   createErrorResponse,
// } from "@/app/lib/utils/apiHelpers";

// // System prompt for single stock queries
// const SINGLE_STOCK_SYSTEM_PROMPT = `You are InvestAI, a smart investment assistant for Indian retail investors.

// **Your Role**: Provide clear, conversational stock information and basic investment insights.

// **Rules**:
// 1. **Symbol Conversion**: Always convert company names to correct NSE stock symbols BEFORE calling get_stock_price.

//    Common mappings:
//    • "Reliance" or "Reliance Industries" → "RELIANCE"
//    • "Tata Motors" → "TATAMOTORS"
//    • "HCL" or "HCL Tech" or "HCL Technologies" → "HCLTECH"
//    • "Infosys" → "INFY"
//    • "TCS" or "Tata Consultancy" → "TCS"
//    • "ICICI Bank" → "ICICIBANK"
//    • "HDFC Bank" → "HDFCBANK"
//    • "Wipro" → "WIPRO"
//    • "ITC" → "ITC"
//    • "Bharti Airtel" or "Airtel" → "BHARTIARTL"
//    • "Adani" → "ADANIENT"
//    • "Mahindra" → "M&M"

// 2. **Tool Usage**:
//    - NEVER use .NS or .BO suffix when calling the tool - it's added automatically
//    - If user asks about a company name, convert it to the stock symbol first
//    - Call the tool only when you need price data

// 3. **Response Style**:
//    - Be conversational and friendly
//    - Use the data from the tool to provide context
//    - Add brief interpretation (e.g., "The stock is up today" or "Trading near 52-week high")
//    - Format numbers clearly with currency symbols and percentages
//    - Never use phrases like "Please note" or "Data may vary"

// 4. **Error Handling**:
//    - If tool returns an error, explain it in simple terms
//    - Suggest correct symbol format if invalid
//    - Don't expose technical error details

// **Example Good Response**:
// "TCS is currently trading at ₹3,245.50, up ₹42.30 (1.32%) today. The stock has been performing well, with a day high of ₹3,260. It's trading in a healthy range between its 52-week low of ₹2,850 and high of ₹3,500. The trading volume is at 2.45M shares, showing good market interest."

// **Example Bad Response**:
// "The price is ₹3,245.50. Please note that the actual data may vary based on current market conditions."`;

// async function createLLMModel() {
//   if (process.env.NODE_ENV === "development") {
//     return new ChatOllama({
//       model: "llama3.2:3b",
//       temperature: 0,
//       baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
//     });
//   } else {
//     return new ChatGroq({
//       model: "llama-3.3-70b-versatile",
//       temperature: 0,
//       apiKey: process.env.GROQ_API_KEY,
//     });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     // Rate limiting
//     const ip = getClientIP(req);
//     if (!checkRateLimit(ip)) {
//       return createRateLimitResponse();
//     }

//     // Parse and validate input
//     const { query } = await req.json();

//     if (!query || typeof query !== "string" || query.trim().length < 3) {
//       return createErrorResponse(
//         "Please provide a valid stock query (at least 3 characters).",
//         400
//       );
//     }

//     console.info("\n🔍 Single Stock Query:", query);

//     // Create prompt template
//     const prompt = ChatPromptTemplate.fromMessages([
//       ["system", SINGLE_STOCK_SYSTEM_PROMPT],
//       ["human", "{input}"],
//       new MessagesPlaceholder("agent_scratchpad"),
//     ]);

//     // Initialize LLM and tools
//     const tools = [StockPriceTool];
//     const model = await createLLMModel();

//     console.info("✅ LLM Model loaded:", model.constructor.name);

//     // Create agent
//     const agent = createToolCallingAgent({ llm: model, tools, prompt });

//     // Create executor
//     const agentExecutor = AgentExecutor.fromAgentAndTools({
//       agent,
//       tools,
//       returnIntermediateSteps: true,
//       maxIterations: 3,
//       earlyStoppingMethod: "force",
//     });

//     console.info("✅ Agent executor ready");

//     // Execute query
//     const result = await agentExecutor.invoke({ input: query });

//     console.info("✅ Query result:", result.output);

//     return Response.json({
//       answer: result.output,
//       intermediateSteps: result.intermediateSteps,
//       success: true,
//     });
//   } catch (error: any) {
//     console.error("❌ Agent execution error:", error);

//     return Response.json(
//       {
//         answer:
//           "Sorry, I encountered an error processing your request. Please try again or rephrase your question.",
//         error: error.message,
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/ask/route.ts - Single Stock Query with NSE
import { NextRequest } from "next/server";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  createErrorResponse,
} from "@/app/lib/utils/apiHelpers";
import { StockPriceTool } from "@/app/lib/tools/stockPriceTool";

const SYSTEM_PROMPT = `You are InvestAI, a smart investment assistant for Indian retail investors.

**Your Role**: Provide clear, actionable insights on Indian stocks using NSE data.

**Stock Symbol Conversion**:
• "Reliance" or "Reliance Industries" → "RELIANCE"
• "Tata Motors" → "TATAMOTORS"
• "HCL" or "HCL Tech" → "HCLTECH"
• "Infosys" → "INFY"
• "TCS" or "Tata Consultancy" → "TCS"
• "ICICI Bank" → "ICICIBANK"
• "HDFC Bank" → "HDFCBANK"
• "Wipro" → "WIPRO"
• "ITC" → "ITC"
• "Bharti Airtel" or "Airtel" → "BHARTIARTL"
• "Adani Enterprises" → "ADANIENT"
• "Mahindra" → "M&M"

**Response Guidelines**:
1. Convert company names to NSE symbols BEFORE calling the tool
2. Use tool WITHOUT any suffix (.NS, .BO) - just the symbol
3. Provide conversational, context-aware analysis
4. Interpret the data (e.g., "near 52-week high", "good volume", "undervalued")
5. Keep responses concise (3-5 sentences max)
6. Use simple language, avoid jargon
7. Never use disclaimers like "Please note" or "data may vary"

**Example Response**:
"TCS is trading at ₹3,245, up 1.3% today with strong volume of 2.5M shares. The stock is positioned at 68% of its 52-week range, showing positive momentum. With a P/E of 28 and steady fundamentals, it's trading at a reasonable valuation for the IT sector."`;

async function createLLMModel() {
  if (process.env.NODE_ENV === "development") {
    return new ChatOllama({
      model: "llama3.2:3b",
      temperature: 0,
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
  } else {
    return new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    if (!checkRateLimit(ip)) {
      return createRateLimitResponse();
    }

    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return createErrorResponse(
        "Please provide a valid stock query (at least 3 characters).",
        400
      );
    }

    console.info("\n🔍 Stock Query:", query);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_PROMPT],
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const tools = [StockPriceTool];
    const model = await createLLMModel();

    console.info("✅ LLM loaded:", model.constructor.name);

    const agent = createToolCallingAgent({ llm: model, tools, prompt });
    const agentExecutor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      returnIntermediateSteps: true,
      maxIterations: 3,
      earlyStoppingMethod: "force",
    });

    const result = await agentExecutor.invoke({ input: query });

    console.info("✅ Query result generated");

    return Response.json({
      answer: result.output,
      intermediateSteps: result.intermediateSteps,
      success: true,
    });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return Response.json(
      {
        answer:
          "Sorry, I encountered an error. Please try again or rephrase your question.",
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
