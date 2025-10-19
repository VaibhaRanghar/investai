import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmService } from "../services/llmService";
import { STOCK_COMPARISON_SYSTEM_PROMPT } from "../prompts/comparisonPrompts";
import { comparisonTool } from "../tools/comparisonTool";

export class ComparisonAgent {
  private executor: AgentExecutor;

  constructor() {
    const llm = llmService.getLLM();

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", STOCK_COMPARISON_SYSTEM_PROMPT],
      [
        "human",
        "Compare {symbol1} vs {symbol2}. Use the comparison tool to fetch data.",
      ],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const tools = [comparisonTool];

    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    this.executor = new AgentExecutor({
      agent,
      tools,
      maxIterations: 3,
      //   verbose: process.env.NODE_ENV === "development",
    });
  }

  async compare(symbol1: string, symbol2: string): Promise<string> {
    console.log("\nSymbol to Compare Agent Symbol 1:", symbol1);
    console.log("\nSymbol to Compare Agent Symbol 2:", symbol2);
    const result = await this.executor.invoke({
      symbol1,
      symbol2,
    });
    console.log("Comparision result:", result);
    return result.output;
  }
}
