import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "../services/llmService";
import { stockAnalysisTool } from "../tools/stockAnalysisTool";
import { technicalTool } from "../tools/technicalTool";
// import { optionsTool } from "../tools/optionsTool";
// import { newsTool } from "../tools/newsTool";
import { STOCK_ANALYSIS_SYSTEM_PROMPT } from "../prompts/analysisPrompts";
import { getSymbolTool } from "../tools/getSymbolTool";
// import { comparisonTool } from "../tools/comparisonTool";

export class AnalysisAgent {
  private executor: AgentExecutor;

  private constructor(executor: AgentExecutor) {
    this.executor = executor; // No async code here!
  }
  static async create(): Promise<AnalysisAgent> {
    const llm = llmService.getLLM();

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", STOCK_ANALYSIS_SYSTEM_PROMPT],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const tools = [
      stockAnalysisTool,
      technicalTool,
      // optionsTool,
      // newsTool,
      getSymbolTool,
      // comparisonTool,
    ];
    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    const executor = new AgentExecutor({
      agent,
      tools,
      maxIterations: 5,
      // verbose: process.env.NODE_ENV === "development",
      returnIntermediateSteps: true,
    });
    return new AnalysisAgent(executor);
  }

  async analyze(query: string): Promise<string> {
    console.log("query to Analyze Agent:", query);
    const result = await this.executor.invoke({
      input: query,
    });
    console.log("Executor Invoked", JSON.stringify(result));
    return result.output;
  }
}
