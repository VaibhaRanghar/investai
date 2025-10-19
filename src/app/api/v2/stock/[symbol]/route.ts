/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { cacheService } from "@/lib/v2/services/cacheService";
import {
  checkRateLimit,
  getClientIp,
  errorResponse,
  successResponse,
} from "@/lib/v2/utils/apiHelpers";
import { nseService } from "@/lib/services/nseService";

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 20, 60000)) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const { symbol } = await params;
    console.log("Symbol in get request= ", symbol);
    if (!symbol || typeof symbol !== "string") {
      return errorResponse("Invalid symbol", 400);
    }

    // Check cache
    const cacheKey = `stock:${symbol}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return successResponse({ data: cached, cached: true });
    }

    // Fetch all data in parallel
    const [equityDetails, tradeInfo, corporateInfo] = await Promise.allSettled([
      nseService.getEquityDetails(symbol),
      nseService.getEquityTradeInfo(symbol),
      nseService.getEquityCorporateInfo(symbol),
    ]);

    if (equityDetails.status === "rejected") {
      return errorResponse(`Stock ${symbol} not found`, 404);
    }

    const data = {
      equity: equityDetails.value,
      trade: tradeInfo.status === "fulfilled" ? tradeInfo.value : null,
      corporate:
        corporateInfo.status === "fulfilled" ? corporateInfo.value : null,
    };

    // Cache for 5 minutes
    cacheService.set(cacheKey, data, cacheService.getTTL("DETAILS"));

    return successResponse({ data, cached: false });
  } catch (error: any) {
    console.error("Stock API Error:", error);
    return errorResponse(error.message || "Failed to fetch stock data", 500);
  }
}
