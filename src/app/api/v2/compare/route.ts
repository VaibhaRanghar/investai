/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { ComparisonAgent } from "@/lib/v2/agents/comparisonAgent";

import {
  checkRateLimit,
  getClientIp,
  errorResponse,
  successResponse,
} from "@/lib/v2/utils/apiHelpers";
import { ComparisonSchema } from "@/lib/v2/utils/validators";
import { nseService } from "@/lib/services/nseService";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 5, 60000)) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const validation = ComparisonSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { symbols } = validation.data;

    // Validate symbols
    const [isValid1, isValid2] = await Promise.all([
      nseService.validateSymbol(symbols[0]),
      nseService.validateSymbol(symbols[1]),
    ]);

    if (!isValid1) {
      return errorResponse(`Stock ${symbols[0]} not found on NSE`, 404);
    }
    if (!isValid2) {
      return errorResponse(`Stock ${symbols[1]} not found on NSE`, 404);
    }

    // Fetch stock details
    const [stock1, stock2] = await nseService.getMultipleStocks(symbols);

    // Generate AI comparison
    const comparisonAgent = new ComparisonAgent();
    const insights = await comparisonAgent.compare(symbols[0], symbols[1]);

    return successResponse({
      success: true,
      data: {
        comparison: {
          stock1: {
            symbol: stock1.info.symbol,
            name: stock1.info.companyName,
            price: stock1.priceInfo.lastPrice,
            change: stock1.priceInfo.change,
            pChange: stock1.priceInfo.pChange,
            peRatio: stock1.metadata.pdSymbolPe,
          },
          stock2: {
            symbol: stock2.info.symbol,
            name: stock2.info.companyName,
            price: stock2.priceInfo.lastPrice,
            change: stock2.priceInfo.change,
            pChange: stock2.priceInfo.pChange,
            peRatio: stock2.metadata.pdSymbolPe,
          },
        },
        insights,
        metadata: {
          processingTime: Date.now() - startTime,
        },
      },
    });
  } catch (error: any) {
    console.error("Compare API Error:", error);
    return errorResponse(error.message || "Failed to compare stocks", 500);
  }
}
