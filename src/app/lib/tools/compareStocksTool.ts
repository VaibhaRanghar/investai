/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/tools/stockComparisonTool.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

async function getStockData(symbol: string) {
  if (symbol.includes(".NS")) symbol = symbol.slice(0, symbol.indexOf("."));
  console.log("Symbol = ", symbol);
  const metricURL = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`;
  const quoteURL = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
  const profileURL = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`;

  try {
    const [metric, quote, profile] = await Promise.all([
      axios.get(metricURL, { timeout: 5000 }).then((r) => r.data.metric),
      axios.get(quoteURL, { timeout: 5000 }).then((r) => r.data),
      axios.get(profileURL, { timeout: 5000 }).then((r) => r.data),
    ]);

    return {
      symbol: symbol,
      name: profile?.name || symbol,
      price: quote?.c || 0,
      change: quote?.d || 0,
      changePercent: quote?.dp || 0,
      peRatio: metric?.peBasicExclExtraTTM || null,
      roe: metric?.roeTTM || 0,
      netProfitMargin: metric?.netProfitMarginTTM || 0,
      grossMargin: metric?.grossMarginTTM || 0,
      operatingMargin: metric?.operatingMarginTTM || 0,
      debtToEquity: metric?.["totalDebt/totalEquityQuarterly"] || null,
      currentRatio: metric?.currentRatioQuarterly || null,
      dividendYield: metric?.currentDividendYieldTTM || 0,
      oneYearReturn: metric?.["52WeekPriceReturnDaily"] || 0,
      high52w: metric?.["52WeekHigh"] || 0,
      low52w: metric?.["52WeekLow"] || 0,
      eps: metric?.epsTTM || 0,
      bookValue: metric?.bookValuePerShareQuarterly || 0,
      marketCap: profile?.marketCapitalization || 0,
      sector: profile?.finnhubIndustry || null,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch data for ${symbol}: ${error.message}`);
  }
}

function compareMetric(valA: any, valB: any, higherBetter = true): string {
  if (valA === null && valB === null) return "Tie";
  if (valA === null) return "B";
  if (valB === null) return "A";
  if (Math.abs(valA - valB) < 0.01) return "Tie";

  if (higherBetter) return valA > valB ? "A" : "B";
  return valA < valB ? "A" : "B";
}

export const StockComparisonTool = tool(
  async ({ symbolA, symbolB }: { symbolA: string; symbolB: string }) => {
    try {
      console.log(`[StockComparisonTool] Comparing ${symbolA} vs ${symbolB}`);

      // Fetch data for both stocks
      const [stockA, stockB] = await Promise.all([
        getStockData(symbolA),
        getStockData(symbolB),
      ]);

      // Calculate winners for each metric
      const winners = {
        price: compareMetric(stockA.price, stockB.price),
        pe: compareMetric(stockA.peRatio, stockB.peRatio, false), // Lower is better
        roe: compareMetric(stockA.roe, stockB.roe),
        netMargin: compareMetric(
          stockA.netProfitMargin,
          stockB.netProfitMargin
        ),
        grossMargin: compareMetric(stockA.grossMargin, stockB.grossMargin),
        debtEquity: compareMetric(
          stockA.debtToEquity,
          stockB.debtToEquity,
          false
        ), // Lower is better
        dividendYield: compareMetric(
          stockA.dividendYield,
          stockB.dividendYield
        ),
        oneYearReturn: compareMetric(
          stockA.oneYearReturn,
          stockB.oneYearReturn
        ),
        eps: compareMetric(stockA.eps, stockB.eps),
      };

      // Count wins
      let winsA = 0,
        winsB = 0,
        ties = 0;
      Object.values(winners).forEach((w) => {
        if (w === "A") winsA++;
        else if (w === "B") winsB++;
        else ties++;
      });

      // Calculate volatility
      const volatilityA = (
        ((stockA.high52w - stockA.low52w) / stockA.low52w) *
        100
      ).toFixed(2);
      const volatilityB = (
        ((stockB.high52w - stockB.low52w) / stockB.low52w) *
        100
      ).toFixed(2);

      // Format comprehensive comparison report for LLM
      return `📊 **COMPREHENSIVE STOCK COMPARISON ANALYSIS**

═══════════════════════════════════════════════════════

**STOCK A: ${stockA.name} (${symbolA})**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **Price & Performance**
   • Current Price: ₹${stockA.price.toFixed(2)}
   • Change: ${stockA.change > 0 ? "+" : ""}₹${stockA.change.toFixed(2)} (${
        stockA.changePercent > 0 ? "+" : ""
      }${stockA.changePercent.toFixed(2)}%)
   • 52-Week Range: ₹${stockA.low52w.toFixed(2)} - ₹${stockA.high52w.toFixed(2)}
   • 1-Year Return: ${stockA.oneYearReturn.toFixed(2)}%
   • 52W Volatility: ${volatilityA}%

💰 **Valuation Metrics**
   • P/E Ratio: ${stockA.peRatio?.toFixed(2) || "N/A"}
   • EPS: ₹${stockA.eps.toFixed(2)}
   • Book Value/Share: ₹${stockA.bookValue.toFixed(2)}
   • Market Cap: ₹${(stockA.marketCap / 1000).toFixed(2)}B

📊 **Profitability**
   • ROE: ${(stockA.roe / 100).toFixed(2)}%
   • Net Profit Margin: ${(stockA.netProfitMargin / 100).toFixed(2)}%
   • Gross Margin: ${(stockA.grossMargin / 100).toFixed(2)}%
   • Operating Margin: ${(stockA.operatingMargin / 100).toFixed(2)}%

💵 **Returns & Financial Health**
   • Dividend Yield: ${(stockA.dividendYield / 100).toFixed(2)}%
   • Debt/Equity: ${stockA.debtToEquity?.toFixed(2) || "N/A"}
   • Current Ratio: ${stockA.currentRatio?.toFixed(2) || "N/A"}

🏢 **Company Info**
   • Sector: ${stockA.sector || "N/A"}

═══════════════════════════════════════════════════════

**STOCK B: ${stockB.name} (${symbolB})**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **Price & Performance**
   • Current Price: ₹${stockB.price.toFixed(2)}
   • Change: ${stockB.change > 0 ? "+" : ""}₹${stockB.change.toFixed(2)} (${
        stockB.changePercent > 0 ? "+" : ""
      }${stockB.changePercent.toFixed(2)}%)
   • 52-Week Range: ₹${stockB.low52w.toFixed(2)} - ₹${stockB.high52w.toFixed(2)}
   • 1-Year Return: ${stockB.oneYearReturn.toFixed(2)}%
   • 52W Volatility: ${volatilityB}%

💰 **Valuation Metrics**
   • P/E Ratio: ${stockB.peRatio?.toFixed(2) || "N/A"}
   • EPS: ₹${stockB.eps.toFixed(2)}
   • Book Value/Share: ₹${stockB.bookValue.toFixed(2)}
   • Market Cap: ₹${(stockB.marketCap / 1000).toFixed(2)}B

📊 **Profitability**
   • ROE: ${(stockB.roe / 100).toFixed(2)}%
   • Net Profit Margin: ${(stockB.netProfitMargin / 100).toFixed(2)}%
   • Gross Margin: ${(stockB.grossMargin / 100).toFixed(2)}%
   • Operating Margin: ${(stockB.operatingMargin / 100).toFixed(2)}%

💵 **Returns & Financial Health**
   • Dividend Yield: ${(stockB.dividendYield / 100).toFixed(2)}%
   • Debt/Equity: ${stockB.debtToEquity?.toFixed(2) || "N/A"}
   • Current Ratio: ${stockB.currentRatio?.toFixed(2) || "N/A"}

🏢 **Company Info**
   • Sector: ${stockB.sector || "N/A"}

═══════════════════════════════════════════════════════

**📈 HEAD-TO-HEAD SCORECARD**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Score:
   • ${stockA.name}: ${winsA} wins
   • ${stockB.name}: ${winsB} wins
   • Ties: ${ties}

Winner by Metric:
   • Price: ${
     winners.price === "A"
       ? stockA.name
       : winners.price === "B"
       ? stockB.name
       : "Tie"
   }
   • P/E Ratio (Lower=Better): ${
     winners.pe === "A" ? stockA.name : winners.pe === "B" ? stockB.name : "Tie"
   }
   • ROE: ${
     winners.roe === "A"
       ? stockA.name
       : winners.roe === "B"
       ? stockB.name
       : "Tie"
   }
   • Net Margin: ${
     winners.netMargin === "A"
       ? stockA.name
       : winners.netMargin === "B"
       ? stockB.name
       : "Tie"
   }
   • Gross Margin: ${
     winners.grossMargin === "A"
       ? stockA.name
       : winners.grossMargin === "B"
       ? stockB.name
       : "Tie"
   }
   • Debt/Equity (Lower=Better): ${
     winners.debtEquity === "A"
       ? stockA.name
       : winners.debtEquity === "B"
       ? stockB.name
       : "Tie"
   }
   • Dividend Yield: ${
     winners.dividendYield === "A"
       ? stockA.name
       : winners.dividendYield === "B"
       ? stockB.name
       : "Tie"
   }
   • 1-Year Return: ${
     winners.oneYearReturn === "A"
       ? stockA.name
       : winners.oneYearReturn === "B"
       ? stockB.name
       : "Tie"
   }
   • EPS: ${
     winners.eps === "A"
       ? stockA.name
       : winners.eps === "B"
       ? stockB.name
       : "Tie"
   }

═══════════════════════════════════════════════════════

Use this comprehensive data to provide detailed investment insights.`;
    } catch (error: any) {
      console.error("[StockComparisonTool] Error:", error.message);
      return `❌ **Comparison Failed**: ${error.message}. Please verify both stock symbols are valid NSE symbols (e.g., TCS.NS, INFY.NS).`;
    }
  },
  {
    name: "compare_stocks",
    description: `Compare two Indian stocks listed on NSE with comprehensive financial metrics and performance data.
    
    This tool fetches and compares:
    - Current prices and price changes
    - Valuation metrics (P/E, EPS, Book Value)
    - Profitability ratios (ROE, Margins)
    - Financial health (Debt/Equity, Current Ratio)
    - Performance metrics (1-year returns, volatility)
    - Company information (sector, market cap)
    
    Input format: Use NSE stock symbols WITH .NS suffix (e.g., 'TCS.NS', 'INFY.NS', 'RELIANCE.NS')
    
    The tool returns a detailed comparison report with winner determination for each metric.`,
    schema: z.object({
      symbolA: z
        .string()
        .describe(
          "First stock NSE symbol WITH .NS suffix (e.g., 'TCS.NS', 'RELIANCE.NS')"
        ),
      symbolB: z
        .string()
        .describe(
          "Second stock NSE symbol WITH .NS suffix (e.g., 'INFY.NS', 'HDFCBANK.NS')"
        ),
    }),
  }
);
