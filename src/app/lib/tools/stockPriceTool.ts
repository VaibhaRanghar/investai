/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

export const StockPriceTool = tool(
  async ({ symbol }: { symbol: string }) => {
    try {
      // Remove any existing suffixes and trim
      let cleanSymbol = symbol.trim().toUpperCase();
      cleanSymbol = cleanSymbol.replace(/\.(NS|BO|BSE)$/i, "");

      // Try NSE first (most liquid market)
      const nsxSymbol = `${cleanSymbol}.NS`;

      console.log(`[StockPriceTool] Fetching data for: ${nsxSymbol}`);

      // Yahoo Finance API endpoint
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${nsxSymbol}?interval=1d&range=1d`;

      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 5000, // 5 second timeout
      });

      const result = response.data?.chart?.result?.[0];
      console.log("Result = ", result);
      if (!result || !result.meta) {
        return `❌ Could not find data for ${symbol}. Please verify it's a valid NSE stock symbol (e.g., RELIANCE, TCS, INFY, HCLTECH).`;
      }

      const meta = result.meta;
      const price = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose;
      const dayHigh = meta.regularMarketDayHigh;
      const dayLow = meta.regularMarketDayLow;
      const volume = meta.regularMarketVolume;

      if (!price) {
        return `❌ Price data unavailable for ${symbol}. Market might be closed or symbol is invalid.`;
      }

      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;
      const changeEmoji = change > 0 ? "📈" : change < 0 ? "📉" : "➡️";

      // Format response
      return `${changeEmoji} **${cleanSymbol}** (NSE)

💰 **Current Price:** ₹${price?.toFixed(2)}
${change > 0 ? "🟢" : change < 0 ? "🔴" : "⚪"} **Change:** ${
        change > 0 ? "+" : ""
      }₹${change?.toFixed(2)} (${
        changePercent > 0 ? "+" : ""
      }${changePercent?.toFixed(2)}%)
📊 **Previous Close:** ₹${previousClose?.toFixed(2)}
📈 **Day High:** ₹${dayHigh?.toFixed(2) || "N/A"}
📉 **Day Low:** ₹${dayLow?.toFixed(2) || "N/A"}
📦 **Volume:** ${volume ? (volume / 1000000)?.toFixed(2) + "M" : "N/A"}

*Data from NSE via Yahoo Finance*`;
    } catch (error: any) {
      console.error("[StockPriceTool] Error:", error.message);

      // Handle specific errors
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return `⏱️ Request timeout. Please try again in a moment.`;
      }

      if (error.response?.status === 404) {
        return `❌ Stock symbol "${symbol}" not found. Please check the symbol and try again.`;
      }

      return `❌ Failed to fetch price for ${symbol}. Error: ${error.message}. Please try again later.`;
    }
  },
  {
    name: "get_stock_price",
    description: `Get real-time stock price for Indian stocks listed on NSE (National Stock Exchange). 
    Input should be the stock symbol WITHOUT .NS suffix (e.g., 'RELIANCE', 'TCS', 'INFY', 'HCLTECH', 'TATAMOTORS').
    The tool automatically adds the .NS suffix for NSE stocks.
    Returns current price, change, percentage change, day high/low, and volume in Indian Rupees (₹).`,
    schema: z.object({
      symbol: z
        .string()
        .describe(
          "Stock symbol without suffix. Examples: 'RELIANCE', 'TCS', 'INFY', 'HCLTECH', 'TATAMOTORS'"
        ),
    }),
  }
);
