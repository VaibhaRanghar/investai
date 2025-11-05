/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool, DynamicTool } from "langchain/tools";
import z from "zod";
import { fetchNSEStocks } from "../utils/fetchNSEStocks";
export const getSymbolTool = new DynamicStructuredTool({
  name: "get_symbol",
  description: "Extract symbol of the company if available in NSE stock API.",
  schema: z.object({
    companyName: z
      .string()
      .describe("Name of the company from the query who's symbol is needed."),
  }),
  func: async ({ companyName }) => {
    try {
      const data = await fetchNSEStocks(companyName);
      return JSON.stringify(data);
    } catch (error: any) {
      return `Error comparing stocks: ${error.message}`;
    }
  },
});
