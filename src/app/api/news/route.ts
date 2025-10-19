/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/news/route.ts - NSE News & Corporate Announcements
import { NextRequest, NextResponse } from "next/server";

import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
} from "@/app/lib/utils/apiHelpers";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!checkRateLimit(ip, 20, 60000)) {
      // 20 requests per minute for news
      return createRateLimitResponse();
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "announcements"; // announcements, stock-news, market-movers
    const symbol = searchParams.get("symbol");
    // const count = parseInt(searchParams.get("count") || "20");

    console.info(`\n📰 News Request: ${type}${symbol ? ` for ${symbol}` : ""}`);

    const data: any = null;

    // switch (type) {
    //   case "announcements":
    //     data = await getCorporateAnnouncements(symbol || undefined, count);
    //     break;

    //   case "stock-news":
    //     if (!symbol) {
    //       return NextResponse.json(
    //         { error: "Symbol required for stock news" },
    //         { status: 400 }
    //       );
    //     }
    //     data = await getStockNews(symbol, count);
    //     break;

    //   case "market-movers":
    //     const [gainers, losers] = await Promise.all([
    //       getTopGainers(10),
    //       getTopLosers(10),
    //     ]);
    //     data = { gainers, losers };
    //     break;

    //   default:
    //     return NextResponse.json(
    //       {
    //         error:
    //           "Invalid type. Use: announcements, stock-news, or market-movers",
    //       },
    //       { status: 400 }
    //     );
    // }

    console.info(
      `✅ Fetched ${Array.isArray(data) ? data.length : "N/A"} items`
    );

    return NextResponse.json({
      type,
      symbol: symbol || null,
      data,
      success: true,
    });
  } catch (error: any) {
    console.error("❌ News error:", error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch news data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
