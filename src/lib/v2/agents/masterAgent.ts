/* eslint-disable @typescript-eslint/no-explicit-any */
import { llmService } from "../services/llmService";
import { AnalysisAgent } from "./analysisAgent";
import { ComparisonAgent } from "./comparisonAgent";

export enum QueryType {
  STOCK_ANALYSIS = "stock_analysis",
  COMPARISON = "comparison",
  GENERAL = "general",
}

export class MasterAgent {
  private analysisAgent: AnalysisAgent;
  private comparisonAgent: ComparisonAgent;

  constructor() {
    this.analysisAgent = new AnalysisAgent();
    this.comparisonAgent = new ComparisonAgent();
  }
  async classifyQuery(
    query: string
  ): Promise<{ type: QueryType; symbols: string[] }> {
    const llm = llmService.getLLM();

    const extractionPrompt = `Extract stock symbols from this query. Return ONLY the stock symbols as a comma-separated list, nothing else.

Query: "${query}"

Valid stock symbols are typically 2-10 uppercase letters like IRCTC, TCS, RELIANCE.
Ignore words like ANALYZE, COMPARE, STOCK, PRICE, etc.

Stock symbols:`;

    const response = await llm.invoke(extractionPrompt);
    const symbols = response.content
      .toString()
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length >= 2 && s.length <= 10);

    // Now classify based on symbols
    const hasComparison = /VS|VERSUS|COMPARE/.test(query.toUpperCase());

    if (hasComparison && symbols.length >= 2) {
      return { type: QueryType.COMPARISON, symbols: symbols.slice(0, 2) };
    }

    if (symbols.length >= 1) {
      return { type: QueryType.STOCK_ANALYSIS, symbols: [symbols[0]] };
    }

    return { type: QueryType.GENERAL, symbols: [] };
  }

  async processQuery(query: string): Promise<{
    type: QueryType;
    answer: string;
    symbols: string[];
    confidence: number;
  }> {
    const classification = await this.classifyQuery(query);
    console.log("\n\nClassification object:", classification);
    let answer: string;
    let confidence = 0.8;

    try {
      switch (classification.type) {
        case QueryType.STOCK_ANALYSIS:
          answer = await this.analysisAgent.analyze(classification.symbols[0]);
          confidence = 0.85;
          break;

        case QueryType.COMPARISON:
          answer = await this.comparisonAgent.compare(
            classification.symbols[0],
            classification.symbols[1]
          );
          confidence = 0.9;
          break;

        case QueryType.GENERAL:
        default:
          answer = `I couldn't identify specific stock symbols in your query. Please include stock symbols (e.g., "Analyze IRCTC" or "Compare IRCTC vs RVNL").`;
          confidence = 0.3;
          break;
      }
      console.log("Master Agent response from llm: ", answer);
      return {
        type: classification.type,
        answer,
        symbols: classification.symbols,
        confidence,
      };
    } catch (error: any) {
      return {
        type: classification.type,
        answer: `Error processing query: ${error.message}`,
        symbols: classification.symbols,
        confidence: 0,
      };
    }
  }
}
