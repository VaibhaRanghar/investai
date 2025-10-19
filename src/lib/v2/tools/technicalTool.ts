/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { cacheService } from "../services/cacheService";
import { FinancialCalculations } from "../utils/calculations";
import { nseService } from "@/lib/services/nseService";

export const technicalTool = new DynamicStructuredTool({
  name: "technical_analysis",
  description:
    "Get technical analysis including moving averages, RSI, trend, support/resistance levels",
  schema: z.object({
    symbol: z.string().describe("Stock symbol for technical analysis"),
  }),
  func: async ({ symbol }) => {
    try {
      const cacheKey = `technical:${symbol}`;
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;

      const [equityDetails, historicalData] = await Promise.all([
        nseService.getEquityDetails(symbol),
        nseService
          .getEquityHistoricalData(symbol, {
            start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            end: new Date(),
          }),
      ]);

      const currentPrice = equityDetails.priceInfo.lastPrice;

      // Calculate technical indicators
      const ma5 = FinancialCalculations.calculateMA(historicalData[0], 5);
      const ma10 = FinancialCalculations.calculateMA(historicalData[0], 10);
      const ma20 = FinancialCalculations.calculateMA(historicalData[0], 20);
      const rsi = FinancialCalculations.calculateRSI(historicalData[0]);
      const volatility =
        FinancialCalculations.calculateVolatility(historicalData[0]);
      const trend = FinancialCalculations.determineTrend(ma5, ma10, ma20);
      const { supports, resistances } =
        FinancialCalculations.calculateSupportResistance(historicalData[0]);

      // Determine RSI signal
      let rsiSignal = "NEUTRAL";
      if (rsi > 70) rsiSignal = "OVERBOUGHT (Consider selling)";
      else if (rsi < 30) rsiSignal = "OVERSOLD (Consider buying)";

      // Determine MACD signal (simplified)
      const macdSignal = ma5 > ma10 ? "Bullish Crossover" : "Bearish Crossover";

      // Price vs MA signals
      const ma5Signal = currentPrice > ma5 ? "BULLISH" : "BEARISH";
      const ma20Signal = currentPrice > ma20 ? "BULLISH" : "BEARISH";

      // Count signals
      let buySignals = 0;
      let sellSignals = 0;

      if (ma5Signal === "BULLISH") buySignals++;
      else sellSignals++;

      if (ma20Signal === "BULLISH") buySignals++;
      else sellSignals++;

      if (trend === "bullish") buySignals += 2;
      else if (trend === "bearish") sellSignals += 2;

      if (rsi < 40) buySignals++;
      else if (rsi > 60) sellSignals++;

      const overallSignal =
        buySignals > sellSignals
          ? "BUY"
          : sellSignals > buySignals
          ? "SELL"
          : "NEUTRAL";

      const analysis = {
        symbol,
        currentPrice: `₹${currentPrice.toFixed(2)}`,
        trend: trend.toUpperCase(),
        movingAverages: {
          ma5: `₹${ma5.toFixed(2)}`,
          ma5Signal: currentPrice > ma5 ? "Above (Bullish)" : "Below (Bearish)",
          ma10: `₹${ma10.toFixed(2)}`,
          ma20: `₹${ma20.toFixed(2)}`,
          ma20Signal:
            currentPrice > ma20 ? "Above (Bullish)" : "Below (Bearish)",
        },
        indicators: {
          rsi: rsi.toFixed(1),
          rsiSignal,
          macd: macdSignal,
          volatility: `${volatility.toFixed(2)}%`,
          volatilityAssessment:
            volatility > 30 ? "High" : volatility < 15 ? "Low" : "Moderate",
        },
        supportLevels: supports.map((s) => `₹${s.toFixed(2)}`),
        resistanceLevels: resistances.map((r) => `₹${r.toFixed(2)}`),
        signals: {
          overallSignal,
          buySignals,
          sellSignals,
          neutralSignals: 8 - buySignals - sellSignals,
        },
      };

      const result = JSON.stringify(analysis, null, 2);
      cacheService.set(cacheKey, result, cacheService.getTTL("DETAILS"));

      return result;
    } catch (error: any) {
      return `Error in technical analysis for ${symbol}: ${error.message}`;
    }
  },
});
