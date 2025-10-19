/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { cacheService } from "../services/cacheService";
import { FinancialCalculations } from "../utils/calculations";
import { nseService } from "@/lib/services/nseService";

export const stockAnalysisTool = new DynamicStructuredTool({
  name: "analyze_stock",
  description:
    "Get comprehensive stock analysis including price, fundamentals, technical indicators, and corporate data for NSE stocks",
  schema: z.object({
    symbol: z
      .string()
      .describe("NSE stock symbol (e.g., IRCTC, TCS, RELIANCE)"),
  }),
  func: async ({ symbol }) => {
    console.log("Symbol sent to stockAnalysis tool from analysisAgent:", symbol);
    try {
      const cacheKey = `analysis:${symbol}`;
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;

      // Fetch data in parallel
      const [equityDetails, tradeInfo, corporateInfo, historical] =
        await Promise.allSettled([
          nseService.getEquityDetails(symbol),
          nseService.getEquityTradeInfo(symbol),
          nseService.getEquityCorporateInfo(symbol),
          nseService.getEquityHistoricalData(symbol, {
            start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            end: new Date(),
          }),
        ]);

      const equity =
        equityDetails.status === "fulfilled" ? equityDetails.value : null;
      const trade = tradeInfo.status === "fulfilled" ? tradeInfo.value : null;
      const corporate =
        corporateInfo.status === "fulfilled" ? corporateInfo.value : null;
      const hist = historical.status === "fulfilled" ? historical.value : null;

      if (!equity) {
        return `Stock ${symbol} not found on NSE.`;
      }

      // Calculate metrics
      const price = equity.priceInfo.lastPrice;
      const change = equity.priceInfo.change;
      const pChange = equity.priceInfo.pChange;
      const position52w = FinancialCalculations.calculate52WeekPosition(
        price,
        equity.priceInfo.weekHighLow.min,
        equity.priceInfo.weekHighLow.max
      );

      // Technical indicators
      let ma5, ma10, ma20, rsi, volatility, trend;
      if (hist) {
        ma5 = FinancialCalculations.calculateMA(hist[0], 5);
        ma10 = FinancialCalculations.calculateMA(hist[0], 10);
        ma20 = FinancialCalculations.calculateMA(hist[0], 20);
        rsi = FinancialCalculations.calculateRSI(hist[0]);
        volatility = FinancialCalculations.calculateVolatility(hist[0]);
        trend = FinancialCalculations.determineTrend(ma5, ma10, ma20);
      }

      const shareHoldingsData = corporate?.shareholdings_patterns
        .data as Record<string, any>;

      // Format response for LLM
      const analysis = {
        symbol: equity.info.symbol,
        name: equity.info.companyName,
        sector: equity.metadata.industry,

        // Price data
        price: `₹${price.toFixed(2)}`,
        change: `${change >= 0 ? "+" : ""}₹${change.toFixed(2)} (${
          pChange >= 0 ? "+" : ""
        }${pChange.toFixed(2)}%)`,
        dayRange: `₹${equity.priceInfo.intraDayHighLow.min.toFixed(
          2
        )} - ₹${equity.priceInfo.intraDayHighLow.max.toFixed(2)}`,
        fiftyTwoWeekRange: `₹${equity.priceInfo.weekHighLow.min.toFixed(
          2
        )} - ₹${equity.priceInfo.weekHighLow.max.toFixed(2)}`,
        position52w: `${position52w.toFixed(1)}% of range`,
        vwap: `₹${equity.priceInfo.vwap.toFixed(2)}`,

        // Fundamentals
        peRatio: equity.metadata.pdSymbolPe?.toFixed(2) || "N/A",
        sectorPE: equity.metadata.pdSectorPe?.toFixed(2) || "N/A",
        marketCap: trade
          ? FinancialCalculations.formatCurrency(
              trade.marketDeptOrderBook.tradeInfo.totalMarketCap * 10000000
            )
          : "N/A",

        // Volume & Delivery
        volume: trade
          ? FinancialCalculations.formatCurrency(
              trade.marketDeptOrderBook.tradeInfo.totalTradedVolume
            )
          : "N/A",
        deliveryPercent: trade
          ? `${trade.securityWiseDP.deliveryToTradedQuantity.toFixed(2)}%`
          : "N/A",

        // Technical
        ...(hist && {
          ma5: `₹${ma5?.toFixed(2)}`,
          ma10: `₹${ma10?.toFixed(2)}`,
          ma20: `₹${ma20?.toFixed(2)}`,
          rsi: rsi?.toFixed(1),
          trend: trend,
          volatility: `${volatility?.toFixed(2)}%`,
        }),

        // Corporate
        ...(corporate && {
          promoterHolding: shareHoldingsData
            ? Object.values(shareHoldingsData)[0]?.[0]?.[
                "Promoter & Promoter Group"
              ]
            : "N/A",
          recentDividend: corporate.corporate_actions?.data?.[0]
            ? `${corporate.corporate_actions.data[0].purpose} on ${corporate.corporate_actions.data[0].exdate}`
            : "No recent dividend",
          latestAnnouncement: corporate.latest_announcements?.data?.[0]
            ? `${corporate.latest_announcements.data[0].subject} on ${corporate.latest_announcements.data[0].broadcastdate}`
            : "No recent announcements",
        }),

        // Trading status
        fnoAvailable: equity.info.isFNOSec ? "Yes" : "No",
        indices: equity.metadata.pdSectorInd,
      };

      const result = JSON.stringify(analysis, null, 2);
      cacheService.set(cacheKey, result, cacheService.getTTL("DETAILS"));

      return result;
    } catch (error: any) {
      return `Error analyzing ${symbol}: ${error.message}`;
    }
  },
});
