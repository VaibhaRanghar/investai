/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { cacheService } from "../services/cacheService";
import { FinancialCalculations } from "../utils/calculations";
import { nseService } from "@/lib/services/nseService";
import { enoughHistory, safeNum, safePercent } from "../utils/validators";

export const technicalTool = new DynamicStructuredTool({
  name: "technical_analysis",
  description: `
Get a detailed technical analysis for any NSE stock.
Use this tool to understand the latest price, trend, moving averages, RSI, MACD signals, volatility assessment, and support/resistance levels.

Input:
- symbol (string): NSE stock symbol (e.g., "IRCTC", "INFY"). Only one symbol per call.

Output:
{
  symbol: string,                      // Stock symbol (e.g., "IRCTC")
  currentPrice: string,                // Formatted, always with ₹ prefix ("₹720.00") or "N/A"
  trend: string,                       // "BULLISH", "BEARISH", "NEUTRAL", or "N/A"
  movingAverages: {
    ma5: string,                       // "₹711.16" or "N/A"
    ma5Signal: string,                 // "Above (Bullish)", "Below (Bearish)", or "N/A"
    ma10: string,
    ma20: string,
    ma20Signal: string
  },
  indicators: {
    rsi: string,                       // "37.0" or "N/A"
    rsiSignal: string,                 // "OVERBOUGHT (Consider selling)", "OVERSOLD (Consider buying)", "NEUTRAL", or "N/A"
    macd: string,                      // "Bullish Crossover", "Bearish Crossover", or "N/A"
    volatility: string,                // "22.10%" or "N/A"
    volatilityAssessment: string       // "High", "Moderate", "Low", or "N/A"
  },
  supportLevels: string[],             // Up to three levels, each "₹" string, or []
  resistanceLevels: string[],          // Up to three levels, each "₹" string, or []
  signals: {
    overallSignal: string,             // "BUY", "SELL", "NEUTRAL", or "N/A"
    buySignals: number,                // Integer count
    sellSignals: number,
    neutralSignals: number
  },
  warning?: string                     // Present ONLY if calculation is based on insufficient price data ("Insufficient price history. Technical indicators may be missing or unreliable.")
}

Notes:
- All outputs are robust: missing or insufficient data will NEVER cause an error, but will produce "N/A", empty lists, or a warning message.
- This tool should only be used for single stocks (no comparisons).
- LLM should interpret "N/A", empty, or warning fields as a signal that not enough data is available, and inform the user accordingly.
- For investing decisions, treat all technical signals as guidance, NOT guarantees.
  `,
  schema: z.object({
    symbol: z.string().describe("NSE stock symbol (e.g., IRCTC, INFY, TATVA)"),
  }),
  func: async ({ symbol }) => {
    try {
      const cacheKey = `technical:${symbol}`;
      const cached = cacheService.get(cacheKey);
      if (cached) return JSON.stringify(cached);

      const [equityDetails, historicalDataResponse] = await Promise.all([
        nseService.getEquityDetails(symbol),
        nseService.getEquityHistoricalData(symbol, {
          start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          end: new Date(),
        }),
      ]);
      const histObj = historicalDataResponse[0];
      const currentPrice = safeNum(equityDetails?.priceInfo?.lastPrice);

      // Check data sufficiency for each indicator
      const hasMA5 = enoughHistory(histObj, 5);
      const hasMA10 = enoughHistory(histObj, 10);
      const hasMA20 = enoughHistory(histObj, 20);
      const hasIndicators = enoughHistory(histObj, 20);

      const ma5 = hasMA5 ? FinancialCalculations.calculateMA(histObj, 5) : null;
      const ma10 = hasMA10
        ? FinancialCalculations.calculateMA(histObj, 10)
        : null;
      const ma20 = hasMA20
        ? FinancialCalculations.calculateMA(histObj, 20)
        : null;

      const rsi = hasIndicators
        ? FinancialCalculations.calculateRSI(histObj)
        : null;
      const volatility = hasIndicators
        ? FinancialCalculations.calculateVolatility(histObj)
        : null;
      const trend = hasIndicators
        ? FinancialCalculations.determineTrend(ma5!, ma10!, ma20!)
        : "N/A";

      // Support/resistance calculations should also check minimum history (e.g., 20 days)
      let supports: any[] = [],
        resistances: any[] = [];
      if (hasIndicators) {
        try {
          const sr = FinancialCalculations.calculateSupportResistance(histObj);
          supports = Array.isArray(sr.supports) ? sr.supports : [];
          resistances = Array.isArray(sr.resistances) ? sr.resistances : [];
        } catch {
          supports = [];
          resistances = [];
        }
      }

      // Signals calculation, only if indicators and MAs are present
      let buySignals = 0,
        sellSignals = 0,
        neutralSignals = 8;
      let overallSignal = "N/A";
      if (currentPrice !== "N/A" && hasMA5 && hasMA20 && hasIndicators) {
        const ma5Signal = currentPrice > safeNum(ma5) ? "BULLISH" : "BEARISH";
        const ma20Signal = currentPrice > safeNum(ma20) ? "BULLISH" : "BEARISH";
        if (ma5Signal === "BULLISH") buySignals++;
        else sellSignals++;
        if (ma20Signal === "BULLISH") buySignals++;
        else sellSignals++;
        if (trend === "bullish") buySignals += 2;
        else if (trend === "bearish") sellSignals += 2;
        if (rsi !== null && (rsi as unknown as string) !== "N/A") {
          if (rsi < 40) buySignals++;
          else if (rsi > 60) sellSignals++;
        }
        overallSignal =
          buySignals > sellSignals
            ? "BUY"
            : sellSignals > buySignals
            ? "SELL"
            : "NEUTRAL";
        neutralSignals = 8 - buySignals - sellSignals;
      }

      // Assemble analysis output with error-safety
      const analysis = {
        symbol: equityDetails?.info?.symbol || "N/A",
        currentPrice: currentPrice !== "N/A" ? `₹${currentPrice}` : "N/A",
        trend: trend && trend !== "N/A" ? trend.toUpperCase() : "N/A",
        movingAverages: {
          ma5: hasMA5 && ma5 !== null ? `₹${safeNum(ma5)}` : "N/A",
          ma5Signal:
            hasMA5 && ma5 !== null && currentPrice !== "N/A"
              ? (currentPrice as unknown as number) > ma5
                ? "Above (Bullish)"
                : "Below (Bearish)"
              : "N/A",
          ma10: hasMA10 && ma10 !== null ? `₹${safeNum(ma10)}` : "N/A",
          ma20: hasMA20 && ma20 !== null ? `₹${safeNum(ma20)}` : "N/A",
          ma20Signal:
            hasMA20 && ma20 !== null && currentPrice !== "N/A"
              ? (currentPrice as unknown as number) > ma20
                ? "Above (Bullish)"
                : "Below (Bearish)"
              : "N/A",
        },
        indicators: {
          rsi:
            hasIndicators &&
            rsi !== null &&
            (rsi as unknown as string) !== "N/A"
              ? safeNum(rsi, 1)
              : "N/A",
          rsiSignal:
            hasIndicators &&
            rsi !== null &&
            (rsi as unknown as string) !== "N/A"
              ? rsi > 70
                ? "OVERBOUGHT (Consider selling)"
                : rsi < 30
                ? "OVERSOLD (Consider buying)"
                : "NEUTRAL"
              : "N/A",
          macd:
            hasMA5 && hasMA10 && ma5 !== null && ma10 !== null
              ? ma5 > ma10
                ? "Bullish Crossover"
                : "Bearish Crossover"
              : "N/A",
          volatility:
            hasIndicators && volatility !== null
              ? safePercent(volatility)
              : "N/A",
          volatilityAssessment:
            hasIndicators && volatility !== null
              ? volatility > 30
                ? "High"
                : volatility < 15
                ? "Low"
                : "Moderate"
              : "N/A",
        },
        supportLevels:
          supports.length > 0 ? supports.map((s) => `₹${safeNum(s)}`) : [],
        resistanceLevels:
          resistances.length > 0
            ? resistances.map((r) => `₹${safeNum(r)}`)
            : [],
        signals: {
          overallSignal,
          buySignals,
          sellSignals,
          neutralSignals,
        },
        // Optionally add warning if underlying data is insufficient
        ...(hasIndicators
          ? {}
          : {
              warning:
                "Insufficient price history. Technical indicators may be missing or unreliable.",
            }),
      };

      // Cache and return
      cacheService.set(cacheKey, analysis, cacheService.getTTL("DETAILS"));
      return JSON.stringify(analysis);
    } catch (error: any) {
      return JSON.stringify({
        error: `Technical analysis error for ${symbol}: ${error.message}`,
      });
    }
  },
});