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

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 30, 60000)) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const cacheKey = "market:status";
    const cached = cacheService.get(cacheKey);
    console.log("MarketStatus cached:", cached === null);

    if (cached) {
      return successResponse({ data: cached, cached: true });
    }

    const marketStatus = await nseService.getMarketStatus();
    // console.log("MarketStatus:", marketStatus);
    cacheService.set(
      cacheKey,
      marketStatus,
      cacheService.getTTL("MARKET_STATUS")
    );

    return successResponse({ data: marketStatus, cached: false });
  } catch (error: any) {
    console.error("Market API Error:", error);
    return errorResponse(error.message || "Failed to fetch market status", 500);
  }
}
