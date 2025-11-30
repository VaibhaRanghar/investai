/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { FinancialCalculations } from "../utils/calculations";
import { nseService } from "@/lib/services/nseService";
import { safeNum, safePercent } from "../utils/validators";

export const stockAnalysisTool = new DynamicStructuredTool({
  name: "analyze_stock",
  description: `Get a comprehensive snapshot of a stock on NSE, including price, trading range, technical indicators, market cap, promoter holdings, recent announcements, and more.

Input: 
- symbol (string): NSE trading symbol (e.g., "TCS", "IRCTC", "UTKARSHBNK").
 
Output:
{
  symbol: string,
  name: string,
  sector: string,
  price: string,              // Formatted. Example: "₹1234.56"
  change: string,             // Formatted. "+₹12.34 (+1.23%)" or "N/A"
  dayRange: string,           // "₹1200.00 - ₹1250.00" or "N/A"
  fiftyTwoWeekRange: string,  // "₹1000.00 - ₹1600.00" or "N/A"
  position52w: string,        // e.g., "48.5% of range" or "N/A"
  vwap: string,               // "₹1230.56" or "N/A"
  peRatio: string,            // e.g., "24.11" or "N/A"
  sectorPE: string,           // "27.33" or "N/A"
  marketCap: string,          // "₹123456.78 Cr" or "N/A"
  volume: string,             // shares traded; show as number or string, e.g. "1,000,000"
  deliveryPercent: string,    // "55.67%" or "N/A"
  ma5, ma10, ma20: string,    // MAs, "₹1342.98" or "N/A"
  rsi: string,                // "48.2" or "N/A"
  trend: string,              // "bullish"/"neutral"/"bearish"/"N/A"
  volatility: string,         // "22.10%" or "N/A"
  promoterHolding: string,    // "72.23" or "N/A"
  recentDividend: string,     // e.g., "Dividend - Rs 15 per share on 15-Aug-2025" or "N/A"
  latestAnnouncement: string, // e.g., "Board Results on 27-Jul-2025" or "No recent announcements"
  fnoAvailable: string,       // "Yes" or "No"
  indices: string             // "NIFTY 50" or "N/A"
}

Notes:
- Missing or unavailable values are always "N/A" (never null or undefined).
- Prices always prefixed with "₹" and rounded to two decimals.
- Volume is always given as a string and refers to quantity of shares unless noted.
- This tool is for single stocks; DO NOT use for comparisons or lists.
`,
  schema: z.object({
    symbol: z
      .string()
      .describe("NSE stock symbol (e.g., IRCTC, TCS, RELIANCE)"),
  }),
  func: async ({ symbol }) => {
    try {
      // Fetch data
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

      // Graceful extraction
      const equity =
        equityDetails.status === "fulfilled" ? equityDetails.value : null;
      const trade = tradeInfo.status === "fulfilled" ? tradeInfo.value : null;
      const corporate =
        corporateInfo.status === "fulfilled" ? corporateInfo.value : null;
      const hist = historical.status === "fulfilled" ? historical.value : null;

      if (!equity) {
        return JSON.stringify({ error: `Stock ${symbol} not found on NSE.` });
      }

      // Calculations with defensive checks
      const price = safeNum(equity.priceInfo.lastPrice);
      const change = safeNum(equity.priceInfo.change);
      const pChange = safeNum(equity.priceInfo.pChange);
      let position52w = "N/A";
      try {
        position52w = safeNum(
          FinancialCalculations.calculate52WeekPosition(
            equity.priceInfo.lastPrice,
            equity.priceInfo.weekHighLow.min,
            equity.priceInfo.weekHighLow.max
          ),
          1
        );
      } catch {
        /* fallback to N/A */
      }

      // Technicals (defensively handle missing or invalid hist)
      let ma5, ma10, ma20, rsi, volatility, trend;
      if (hist) {
        try {
          ma5 = FinancialCalculations.calculateMA(hist[0], 5);
          ma10 = FinancialCalculations.calculateMA(hist[0], 10);
          ma20 = FinancialCalculations.calculateMA(hist[0], 20);
          rsi = FinancialCalculations.calculateRSI(hist[0], 1);
          volatility = safePercent(
            FinancialCalculations.calculateVolatility(hist[0])
          );
          trend =
            FinancialCalculations.determineTrend(ma5, ma10, ma20) || "N/A";
        } catch {
          ma5 = ma10 = ma20 = rsi = volatility = trend = "N/A";
        }
      } else {
        ma5 = ma10 = ma20 = rsi = volatility = trend = "N/A";
      }

      // Shareholdings guard
      let promoterHolding = "N/A";
      if (corporate?.shareholdings_patterns?.data) {
        const shareData = Object.values(
          corporate.shareholdings_patterns.data
        ).pop() as Record<string, any>;
        const prom = shareData?.[0]?.["Promoter & Promoter Group"];
        promoterHolding = prom != null && prom !== "" ? prom : "N/A";
      }

      // Response object (every field safe-guarded)
      const analysis = {
        symbol: equity.info.symbol || "N/A",
        name: equity.info.companyName || "N/A",
        sector: equity.metadata.industry || "N/A",

        price: `₹${price}`,
        change:
          change !== "N/A" && pChange !== "N/A"
            ? `${(change as unknown as number) >= 0 ? "+" : ""}₹${change} (${
                (pChange as unknown as number) >= 0 ? "+" : ""
              }${pChange}%)`
            : "N/A",
        dayRange: `₹${safeNum(
          equity.priceInfo.intraDayHighLow?.min
        )} - ₹${safeNum(equity.priceInfo.intraDayHighLow?.max)}`,
        fiftyTwoWeekRange: `₹${safeNum(
          equity.priceInfo.weekHighLow?.min
        )} - ₹${safeNum(equity.priceInfo.weekHighLow?.max)}`,
        position52w: position52w !== "N/A" ? `${position52w}% of range` : "N/A",
        vwap: `₹${safeNum(equity.priceInfo.vwap)}`,

        peRatio: safeNum(equity.metadata.pdSymbolPe) || "N/A",
        sectorPE: safeNum(equity.metadata.pdSectorPe) || "N/A",
        marketCap: trade
          ? FinancialCalculations.formatCurrency(
              Number(
                trade.marketDeptOrderBook?.tradeInfo?.totalMarketCap || 0
              ) * 1e7
            )
          : "N/A",

        volume: trade
          ? FinancialCalculations.formatCurrency(
              Number(trade.marketDeptOrderBook?.tradeInfo?.totalTradedVolume) ||
                0
            )
          : "N/A",
        deliveryPercent: trade
          ? safePercent(trade.securityWiseDP?.deliveryToTradedQuantity)
          : "N/A",

        ma5: ma5 !== "N/A" ? `₹${ma5}` : "N/A",
        ma10: ma10 !== "N/A" ? `₹${ma10}` : "N/A",
        ma20: ma20 !== "N/A" ? `₹${ma20}` : "N/A",
        rsi,
        trend,
        volatility,

        promoterHolding,
        recentDividend: corporate?.corporate_actions?.data?.[0]
          ? `${corporate.corporate_actions.data[0].purpose} on ${corporate.corporate_actions.data[0].exdate}`
          : "No recent dividend",
        latestAnnouncement: corporate?.latest_announcements?.data?.[0]
          ? `${corporate.latest_announcements.data[0].subject} on ${corporate.latest_announcements.data[0].broadcastdate}`
          : "No recent announcements",

        fnoAvailable: equity.info.isFNOSec ? "Yes" : "No",
        indices: equity.metadata.pdSectorInd || "N/A",
      };

      // Return structured
      return JSON.stringify(analysis);
    } catch (error: any) {
      return JSON.stringify({
        error: `Error analyzing ${symbol}: ${error.message}`,
      });
    }
  },
});
