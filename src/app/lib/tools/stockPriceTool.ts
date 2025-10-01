import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

export const StockPriceTool = tool(
  async ({ symbol }: { symbol: string }) => {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY!;
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

      const response = await axios.get(url);
      const price = response.data["Global Quote"]?.["05. price"];

      console.info("Response in stockTool = ", response);

      if (!price) {
        return `Could not find price for ${symbol}. Please check the symbol.`;
      }

      return `The current price of ${symbol} is ₹${parseFloat(price).toFixed(
        2
      )}.`;
    } catch (error) {
      console.error("Stock API error:", error);
      return `Failed to fetch price for ${symbol}.`;
    }
  },
  {
    name: "get_stock_price",
    description:
      "Get the current stock price for a given symbol (e.g., 'RELIANCE.BSE' or 'AAPL').",
    schema: z.object({
      symbol: z
        .string()
        .describe("The stock symbol, e.g., 'RELIANCE.BSE' or 'AAPL'"),
    }),
  }
);

// // src/lib/tools/stockPriceTool.ts
// import { StructuredTool } from "@langchain/core/tools";
// import { z } from "zod";

// export class StockPriceTool extends StructuredTool {
//   name = "get_stock_price";
//   description =
//     "Get current stock price. Use symbols like 'RELIANCE.NS' for NSE or 'RELIANCE.BO' for BSE.";

//   schema = z.object({
//     symbol: z
//       .string()
//       .describe("Stock symbol (e.g., 'RELIANCE.NS', 'TATAMOTORS.NS', 'AAPL')"),
//   });

//   async _call(input: z.infer<typeof this.schema>): Promise<string> {
//     const { symbol } = input;

//     try {
//       // Use a free Yahoo Finance CORS proxy
//       const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
//         `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`
//       )}`;

//       const response = await fetch(proxyUrl);
//       const data = await response.json();

//       const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;

//       if (!price) {
//         return `Could not find price for ${symbol}. Try 'RELIANCE.NS' or 'TATAMOTORS.NS'.`;
//       }

//       return `${symbol} is trading at ₹${price.toFixed(2)}.`;
//     } catch (error) {
//       console.error("Yahoo Finance error:", error);
//       return `Failed to fetch price for ${symbol}.`;
//     }
//   }
// }
