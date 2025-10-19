import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "../services/llmService";
import { stockAnalysisTool } from "../tools/stockAnalysisTool";
import { technicalTool } from "../tools/technicalTool";
import { optionsTool } from "../tools/optionsTool";
import { newsTool } from "../tools/newsTool";
import { STOCK_ANALYSIS_SYSTEM_PROMPT } from "../prompts/analysisPrompts";

export class AnalysisAgent {
  private executor: AgentExecutor;

  constructor() {
    const llm = llmService.getLLM();

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", STOCK_ANALYSIS_SYSTEM_PROMPT],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const tools = [stockAnalysisTool, technicalTool, optionsTool, newsTool];

    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    this.executor = new AgentExecutor({
      agent,
      tools,
      maxIterations: 3,
      // verbose: process.env.NODE_ENV === "development",
    });
  }

  async analyze(symbol: string): Promise<string> {
    console.log("Symbol to Analyze Agent:", symbol);
    debugger;
    const result = await this.executor.invoke({
      input: `Analyze the stock ${symbol} comprehensively. Use all available tools to gather data and provide detailed investment analysis.`,
    });

    return result.output;
  }
}
