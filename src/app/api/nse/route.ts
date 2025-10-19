import { NextRequest, NextResponse } from "next/server";
import { NseIndia } from "stock-nse-india";

export async function GET(req: NextRequest) {
  const nse = new NseIndia();

  const range = {
    start: new Date("2020-01-01"),
    end: new Date("2023-12-31"),
  };

  // const tradeInfo = await nse.getEquityTradeInfo("IRCTC");
  // const corpInfo = await nse.getEquityCorporateInfo("IRCTC");
  // const equityDetails = await nse.getEquityDetails("IRCTC");
  // const marketStatus = await nse.getMarketStatus();
  // const historicalData = await nse.getEquityHistoricalData("IRCTC", range);
  const getAllStock = await nse.getAllStockSymbols();

  return NextResponse.json({
    // getAllStock,
    // tradeInfo,
    // corpInfo,
    // range,
    // historicalData,
    // equityDetails,
    // marketStatus,
    getAllStock,
  });
}
