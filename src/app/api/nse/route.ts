import { testTool } from "@/lib/v2/tools/toolTester";
// import { fetchNSEStocks } from "@/lib/v2/utils/fetchNSEStocks";
import { NextResponse } from "next/server";
// import { NseIndia } from "stock-nse-india";

export async function GET() {
  // const nse = new NseIndia();
  const TAT = await testTool("CAPTRU-RE1");

  // const range = {
  //   start: new Date("2020-01-01"),
  //   end: new Date("2023-12-31"),
  // };
  // const range2 = {
  //   start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  //   end: new Date(),
  // };
  // const circulars = await nse.getCirculars();
  // const glossary = await nse.getGlossary();
  // const marketTurnover = await nse.getMarketTurnover();
  // const preMarketData = await nse.getPreOpenMarketData();
  // const endpointData = await nse.getData(
  //   "https://www.nseindia.com/api/live-analysis-variations?index=gainers&type=FINANCIAL_SERVICES"
  // );
  // const dailyCap = await nse.getMergedDailyReportsCapital();
  // const dailyDebt = await nse.getMergedDailyReportsDebt();
  // const dailyDerivatives = await nse.getMergedDailyReportsDerivatives();
  // const equityMaster = await nse.getEquityMaster();
  // const trade = await nse.getEquityTradeInfo("UTKARSHBNK");
  // const corporate = await nse.getEquityCorporateInfo("UTKARSHBNK");
  // const equity = await nse.getEquityDetails("TATVA");
  // const marketStatus = await nse.getMarketStatus();
  // const historicalData = await nse.getEquityHistoricalData("TATVA", range2);
  // const getAllStock = await nse.getAllStockSymbols();
  // const stocks = await fetchNSEStocks("Utkarsh");
  return NextResponse.json({
    TAT,
    // getAllStock,
    // trade,
    // corporate,
    // range,
    // historicalData,
    // equity,
    // marketStatus,
    // circulars,
    // glossary,
    // marketTurnover,
    // preMarketData,
    // dailyCap,
    // dailyDebt,
    // dailyDerivatives,
    // equityMaster,
    // endpointData,
    // stocks,
  });
}

JSON.stringify({
  symbol: "HDFCBANK",
  name: "HDFC Bank Limited",
  sector: "Private Sector Bank",
  price: "₹985.70",
  change: "₹-6.95 (-0.70%)",
  dayRange: "₹983.70 - ₹997.00",
  fiftyTwoWeekRange: "₹812.15 - ₹1020.50",
  position52w: "83.3% of range",
  vwap: "₹990.21",
  peRatio: "21.01",
  sectorPE: "20.74",
  marketCap: "₹1515680.68 Cr",
  volume: "₹200.25",
  deliveryPercent: "53.90%",
  ma5: "₹978.53",
  ma10: "₹966.94",
  ma20: "₹965.16",
  rsi: "60.2",
  trend: "bullish",
  volatility: "121.13%",
  promoterHolding: "   0.00",
  recentDividend: "Bonus 1:1 on 26-Aug-2025",
  latestAnnouncement: "Outcome of Board Meeting on 30-Oct-2025 11:16:51",
  fnoAvailable: "Yes",
  indices: "NIFTY 50",
});
