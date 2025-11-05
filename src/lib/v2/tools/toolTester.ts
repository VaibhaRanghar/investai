import { cacheService } from "../services/cacheService";
import { FinancialCalculations } from "../utils/calculations";
import { nseService } from "@/lib/services/nseService";
import { enoughHistory, safeNum, safePercent } from "../utils/validators";
import { JsonOutputParser } from "@langchain/core/output_parsers";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function testTool(symbol: string) {
  //   const SAT = await stockAnalysisToolSafe(symbol);
  const TAT = await technicalAnalysisToolSafe(symbol);
  return { TAT };
}

async function technicalAnalysisToolSafe(symbol: string) {
  try {
    const cacheKey = `technical:${symbol}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

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
          hasIndicators && rsi !== null && (rsi as unknown as string) !== "N/A"
            ? safeNum(rsi, 1)
            : "N/A",
        rsiSignal:
          hasIndicators && rsi !== null && (rsi as unknown as string) !== "N/A"
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
        resistances.length > 0 ? resistances.map((r) => `₹${safeNum(r)}`) : [],
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
    return analysis;
  } catch (error: any) {
    return {
      error: `Technical analysis error for ${symbol}: ${error.message}`,
    };
  }
}

// <-------------------------------------------------------------------------------------------------->
// <-------------------------------------------------------------------------------------------------->
// <-------------------------------------------------------------------------------------------------->
// <-------------------------------------------------------------------------------------------------->

async function stockAnalysisToolSafe(symbol: string) {
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
      return { error: `Stock ${symbol} not found on NSE.` };
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
        trend = FinancialCalculations.determineTrend(ma5, ma10, ma20) || "N/A";
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
            Number(trade.marketDeptOrderBook?.tradeInfo?.totalMarketCap || 0) *
              1e7
          )
        : "N/A",

      volume: trade
        ? FinancialCalculations.formatCurrency(
            Number(trade.marketDeptOrderBook?.tradeInfo?.totalTradedVolume) || 0
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

    const parser = new JsonOutputParser();
    const result = parser.parse(JSON.stringify(analysis));
    // Return structured
    return result;
  } catch (error: any) {
    return { error: `Error analyzing ${symbol}: ${error.message}` };
  }
}

interface stockAnalysisToolResultDataType {
  fnoAvailable: string;
  indices: string;
  promoterHolding?: any;
  recentDividend?: string | undefined;
  latestAnnouncement?: string | undefined;
  ma5?: string | undefined;
  ma10?: string | undefined;
  ma20?: string | undefined;
  rsi?: string | undefined;
  trend?: "bullish" | "bearish" | "neutral" | undefined;
  volatility?: string | undefined;
  symbol: string;
  name: string;
  sector: string;
  price: string;
  change: string;
  dayRange: string;
  fiftyTwoWeekRange: string;
  position52w: string;
  vwap: string;
  peRatio: string;
  sectorPE: string;
  marketCap: string;
  volume: string;
  deliveryPercent: string;
}
