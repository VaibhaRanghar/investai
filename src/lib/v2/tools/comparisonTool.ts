/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { cacheService } from "../services/cacheService";
import { FinancialCalculations } from "../utils/calculations";
import { nseService } from "@/lib/services/nseService";

export const comparisonTool = new DynamicStructuredTool({
  name: "compare_stocks",
  description:
    "Compare two NSE stocks side-by-side with key metrics for investment decision making",
  schema: z.object({
    symbol1: z.string().describe("First stock symbol"),
    symbol2: z.string().describe("Second stock symbol"),
  }),
  func: async ({ symbol1, symbol2 }) => {
    try {
      const cacheKey = `comparison:${symbol1}:${symbol2}`;
      const cached = cacheService.get(cacheKey);
      if (cached) return JSON.stringify(cached);

      // Fetch both stocks in parallel
      const [stock1Data, stock2Data] = await Promise.all([
        Promise.all([
          nseService.getEquityDetails(symbol1),
          nseService.getEquityTradeInfo(symbol1),
          nseService.getEquityCorporateInfo(symbol1),
          nseService.getEquityHistoricalData(symbol1, {
            start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            end: new Date(),
          }),
        ]),
        Promise.all([
          nseService.getEquityDetails(symbol2),
          nseService.getEquityTradeInfo(symbol2),
          nseService.getEquityCorporateInfo(symbol2),
          nseService.getEquityHistoricalData(symbol2, {
            start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            end: new Date(),
          }),
        ]),
      ]);

      const [equity1, trade1, corporate1, hist1] = stock1Data;
      const [equity2, trade2, corporate2, hist2] = stock2Data;

      // Calculate metrics for both stocks
      const getMetrics = (
        equity: any,
        trade: any,
        corporate: any,
        hist: any,
        symbol: string
      ) => {
        const price = equity.priceInfo.lastPrice;
        const position52w = FinancialCalculations.calculate52WeekPosition(
          price,
          equity.priceInfo.weekHighLow.min,
          equity.priceInfo.weekHighLow.max
        );
        const shareHoldingsData = corporate?.shareholdings_patterns
          .data as Record<string, any>;
        // Calculate returns
        const oneYearReturn = hist?.data?.[0]
          ? ((price - hist.data[hist.data.length - 1].CH_CLOSING_PRICE) /
              hist.data[hist.data.length - 1].CH_CLOSING_PRICE) *
            100
          : 0;

        const oneMonthReturn = hist?.data?.[0]
          ? ((price -
              hist.data[Math.min(20, hist.data.length - 1)].CH_CLOSING_PRICE) /
              hist.data[Math.min(20, hist.data.length - 1)].CH_CLOSING_PRICE) *
            100
          : 0;

        // Get latest financial results
        const latestResults = corporate?.financial_results?.data?.[0];
        const profitMargin = latestResults
          ? (parseFloat(latestResults.proLossAftTax) /
              parseFloat(latestResults.income)) *
            100
          : null;

        return {
          symbol,
          name: equity.info.companyName,
          sector: equity.metadata.industry,
          price: `₹${price.toFixed(2)}`,
          dayChange: `${
            equity.priceInfo.change >= 0 ? "+" : ""
          }${equity.priceInfo.change.toFixed(2)} (${
            equity.priceInfo.pChange >= 0 ? "+" : ""
          }${equity.priceInfo.pChange.toFixed(2)}%)`,
          peRatio: equity.metadata.pdSymbolPe?.toFixed(2) || "N/A",
          sectorPE: equity.metadata.pdSectorPe?.toFixed(2) || "N/A",
          eps: latestResults?.reDilEPS || "N/A",
          marketCap: trade
            ? FinancialCalculations.formatCurrency(
                trade.marketDeptOrderBook.tradeInfo.totalMarketCap * 10000000
              )
            : "N/A",
          profitMargin: profitMargin ? `${profitMargin.toFixed(2)}%` : "N/A",
          dividendYield: equity.securityInfo.dividendYield
            ? `${equity.securityInfo.dividendYield.toFixed(2)}%`
            : "N/A",
          bookValue: equity.securityInfo.bookValue
            ? `₹${equity.securityInfo.bookValue.toFixed(2)}`
            : "N/A",
          deliveryPercent: trade
            ? `${trade.securityWiseDP.deliveryToTradedQuantity.toFixed(2)}%`
            : "N/A",
          position52w: `${position52w.toFixed(1)}%`,
          week52High: `₹${equity.priceInfo.weekHighLow.max.toFixed(2)}`,
          week52Low: `₹${equity.priceInfo.weekHighLow.min.toFixed(2)}`,
          oneYearReturn: `${
            oneYearReturn >= 0 ? "+" : ""
          }${oneYearReturn.toFixed(2)}%`,
          oneMonthReturn: `${
            oneMonthReturn >= 0 ? "+" : ""
          }${oneMonthReturn.toFixed(2)}%`,
          volume: trade
            ? FinancialCalculations.formatCurrency(
                trade.marketDeptOrderBook.tradeInfo.totalTradedVolume
              )
            : "N/A",
          promoterHolding: corporate?.shareholdings_patterns?.data
            ? Object.values(shareHoldingsData)[0]?.[0]?.[
                "Promoter & Promoter Group"
              ]
            : "N/A",
          recentDividend:
            corporate?.corporate_actions?.data?.[0]?.purpose ||
            "No recent dividend",
          fnoAvailable: equity.info.isFNOSec ? "Yes" : "No",
        };
      };

      const stock1Metrics = getMetrics(
        equity1,
        trade1,
        corporate1,
        hist1,
        symbol1
      );
      const stock2Metrics = getMetrics(
        equity2,
        trade2,
        corporate2,
        hist2,
        symbol2
      );

      // Format for LLM
      const comparison = {
        stock1: stock1Metrics,
        stock2: stock2Metrics,
        comparison_summary: {
          valuation:
            parseFloat(stock1Metrics.peRatio) <
            parseFloat(stock2Metrics.peRatio)
              ? `${symbol1} has lower P/E (better valuation)`
              : `${symbol2} has lower P/E (better valuation)`,
          performance:
            parseFloat(stock1Metrics.oneYearReturn) >
            parseFloat(stock2Metrics.oneYearReturn)
              ? `${symbol1} has better 1-year returns`
              : `${symbol2} has better 1-year returns`,
          quality:
            parseFloat(stock1Metrics.profitMargin) >
            parseFloat(stock2Metrics.profitMargin)
              ? `${symbol1} has higher profit margin`
              : `${symbol2} has higher profit margin`,
        },
      };

      const result = JSON.stringify(comparison, null, 2);
      cacheService.set(cacheKey, result, cacheService.getTTL("DETAILS"));

      return result;
    } catch (error: any) {
      return `Error comparing stocks: ${error.message}`;
    }
  },
});
