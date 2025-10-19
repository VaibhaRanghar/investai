/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/compare/route.ts
import { NextRequest, NextResponse } from "next/server";
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
} from "@/app/lib/utils/apiHelpers";
import axios from "axios";
import { StockComparisonTool } from "@/app/lib/tools/compareStocksTool";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

// System prompt for stock comparison
const COMPARISON_SYSTEM_PROMPT = `You are InvestAI, an expert investment analyst specializing in Indian stock markets.

**Your Task**: Provide comprehensive, actionable investment insights when comparing two stocks.

**Analysis Framework**:

1. **Executive Summary** (2-3 sentences):
   - Quick verdict on which stock is better suited for different investor types
   - Key differentiating factor between the stocks

2. **Valuation Analysis**:
   - Compare P/E ratios and what they indicate
   - EPS comparison and growth implications
   - Book value and intrinsic value assessment
   - Relative valuation (which is expensive/cheap and why)

3. **Profitability & Efficiency**:
   - ROE comparison (return on shareholder equity)
   - Profit margin analysis (net, gross, operating)
   - Which company is more operationally efficient
   - Sustainability of profitability

4. **Financial Health & Risk**:
   - Debt levels and leverage analysis
   - Liquidity position (current ratio)
   - Financial stability assessment
   - Key risks for each stock

5. **Performance & Returns**:
   - Historical returns comparison
   - Volatility analysis (which is riskier)
   - Dividend yield and income potential
   - Price momentum and trend

6. **Investment Recommendation**:
   - **For Growth Investors**: Which stock is better and why
   - **For Value Investors**: Which offers better value
   - **For Income Investors**: Which provides better dividends
   - **For Conservative Investors**: Which is safer
   - Overall pick with clear reasoning

**Guidelines**:
- Be objective and data-driven, but provide clear opinions
- Use specific numbers from the comparison data
- Explain WHY one metric is better, not just THAT it's better
- Provide actionable insights, not generic statements
- Consider both quantitative metrics and qualitative factors
- Write in clear, simple language for retail investors
- No generic disclaimers or "please consult a financial advisor" - be confident
- Structure your response with clear headings and bullet points
- Keep analysis concise but comprehensive (aim for 400-600 words)

**Tone**: Professional yet accessible, confident yet balanced, insightful yet practical.`;

// Interface for stock data
interface StockMetrics {
  symbol: string;
  name: string;
  price: number;
  peRatio: number | null;
  roe: number;
  netProfitMargin: number;
  debtToEquity: number | null;
  dividendYield: number;
  oneYearReturn: number;
  high52w: number;
  low52w: number;
  grossMargin: number;
  eps: number;
  bookValue: number;
  sector: string | null;
  logo: string | null;
}

// Fetch stock data from Finnhub
async function getStockComparison(symbol: string): Promise<StockMetrics> {
  const metricURL = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`;
  const quoteURL = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
  const profileURL = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`;

  const [metric, quote, profile] = await Promise.all([
    axios.get(metricURL, { timeout: 5000 }).then((r) => r.data.metric),
    axios.get(quoteURL, { timeout: 5000 }).then((r) => r.data),
    axios.get(profileURL, { timeout: 5000 }).then((r) => r.data),
  ]);
  console.log("Metric", metric);
  console.log("Quote", quote);
  console.log("Profile", profile);
  return {
    symbol: symbol,
    name: profile?.name || symbol,
    price: quote?.c || 0,
    peRatio: metric?.peBasicExclExtraTTM || null,
    roe: metric?.roeTTM || 0,
    netProfitMargin: metric?.netProfitMarginTTM || 0,
    debtToEquity: metric?.["totalDebt/totalEquityQuarterly"] || null,
    dividendYield: metric?.currentDividendYieldTTM || 0,
    oneYearReturn: metric?.["52WeekPriceReturnDaily"] || 0,
    high52w: metric?.["52WeekHigh"] || 0,
    low52w: metric?.["52WeekLow"] || 0,
    grossMargin: metric?.grossMarginTTM || 0,
    eps: metric?.epsTTM || 0,
    bookValue: metric?.bookValuePerShareQuarterly || 0,
    sector: profile?.finnhubIndustry || null,
    logo: profile?.logo || null,
  };
}

// Determine winner for a metric
function determineWinner(
  valueA: number | null,
  valueB: number | null,
  higherIsBetter: boolean = true
): "A" | "B" | "Tie" {
  if (valueA === null && valueB === null) return "Tie";
  if (valueA === null) return "B";
  if (valueB === null) return "A";

  if (Math.abs(valueA - valueB) < 0.01) return "Tie";

  if (higherIsBetter) {
    return valueA > valueB ? "A" : "B";
  } else {
    return valueA < valueB ? "A" : "B";
  }
}

// Create LLM model
async function createLLMModel() {
  if (process.env.NODE_ENV === "development") {
    return new ChatOllama({
      model: "llama3.2:3b",
      temperature: 0.3,
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
  } else {
    return new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      apiKey: process.env.GROQ_API_KEY,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    if (!checkRateLimit(ip)) {
      return createRateLimitResponse();
    }

    // Parse and validate input
    const { symbols } = await request.json();

    if (!symbols || !Array.isArray(symbols) || symbols.length !== 2) {
      return NextResponse.json(
        { error: "Please provide exactly two stock symbols as an array" },
        { status: 400 }
      );
    }

    const [symbolA, symbolB] = symbols;

    if (!symbolA || !symbolB) {
      return NextResponse.json(
        { error: "Both stock symbols are required" },
        { status: 400 }
      );
    }

    console.info(`\n🔍 Comparing: ${symbolA} vs ${symbolB}`);

    // Fetch raw stock data in parallel
    const [stockA, stockB] = await Promise.all([
      getStockComparison(symbolA),
      getStockComparison(symbolB),
    ]);

    console.info("✅ Stock data fetched for both symbols");

    // Calculate winners for each metric
    const winnerByMetric = {
      price: determineWinner(stockA.price, stockB.price),
      pe: determineWinner(stockA.peRatio, stockB.peRatio, false),
      roe: determineWinner(stockA.roe, stockB.roe),
      margin: determineWinner(stockA.netProfitMargin, stockB.netProfitMargin),
      debtEquity: determineWinner(
        stockA.debtToEquity,
        stockB.debtToEquity,
        false
      ),
      dividendYield: determineWinner(
        stockA.dividendYield,
        stockB.dividendYield
      ),
      oneYearReturn: determineWinner(
        stockA.oneYearReturn,
        stockB.oneYearReturn
      ),
      high52w: determineWinner(stockA.high52w, stockB.high52w),
      low52w: determineWinner(stockA.low52w, stockB.low52w, false),
    };

    // Calculate win counts
    let winCountA = 0;
    let winCountB = 0;
    Object.values(winnerByMetric).forEach((winner) => {
      if (winner === "A") winCountA++;
      if (winner === "B") winCountB++;
    });

    // Generate basic insight (fallback)
    let insight = "Unable to generate auto-insight at the moment.";
    if (winCountA > winCountB) {
      insight = `${stockA.name} shows stronger fundamentals with superior performance in ${winCountA} out of 9 key metrics.`;
    } else if (winCountB > winCountA) {
      insight = `${stockB.name} demonstrates better overall performance, leading in ${winCountB} out of 9 key metrics.`;
    } else {
      insight = `Both stocks show comparable performance across key metrics.`;
    }

    console.info("✅ Winners calculated. Scores:", { winCountA, winCountB });

    // Generate LLM analysis
    let llmAnalysis = insight; // Default fallback

    try {
      console.info("🤖 Generating LLM analysis...");

      // Create prompt template
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", COMPARISON_SYSTEM_PROMPT],
        [
          "human",
          "Compare these two stocks and provide comprehensive investment insights:\n\n{input}",
        ],
        new MessagesPlaceholder("agent_scratchpad"),
      ]);

      // Initialize LLM and tools
      const tools = [StockComparisonTool];
      const model = await createLLMModel();

      console.info("✅ LLM Model loaded:", model.constructor.name);

      // Create agent
      const agent = createToolCallingAgent({ llm: model, tools, prompt });

      // Create executor
      const agentExecutor = AgentExecutor.fromAgentAndTools({
        agent,
        tools,
        returnIntermediateSteps: false,
        maxIterations: 3,
        earlyStoppingMethod: "force",
      });

      // Execute comparison with LLM
      const result = await agentExecutor.invoke({
        input: `Analyze and compare ${symbolA} (${stockA.name}) with ${symbolB} (${stockB.name}). Provide detailed investment insights for retail investors.`,
      });

      llmAnalysis = result.output;
      console.info("✅ LLM analysis generated successfully");
      console.log(llmAnalysis);
    } catch (llmError: any) {
      console.error("⚠️ LLM analysis failed:", llmError.message);
      console.info("ℹ️ Using fallback basic insight");
      // llmAnalysis already set to basic insight as fallback
    }
    
    // Return comprehensive response
    return NextResponse.json({
      stockA,
      stockB,
      winnerByMetric,
      insight,
      llmAnalysis,
      success: true,
    });
  } catch (error: any) {
    console.error("❌ Comparison error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to compare stocks. Please check the symbols and try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
