/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { cacheService } from '@/lib/v2/services/cacheService';
import {
  checkRateLimit,
  getClientIp,
  errorResponse,
  successResponse,
} from '@/lib/v2/utils/apiHelpers';
import { nseService } from '@/lib/services/nseService';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 10, 60000)) {
      return errorResponse('Too many requests. Please try again later.', 429);
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return errorResponse('Symbol parameter is required', 400);
    }

    const cacheKey = `options:${symbol}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return successResponse({ data: cached, cached: true });
    }

    const optionsData = await nseService.getEquityOptionChain(symbol);
    
    cacheService.set(cacheKey, optionsData, cacheService.getTTL('OPTIONS'));

    return successResponse({ data: optionsData, cached: false });
  } catch (error: any) {
    console.error('Options API Error:', error);
    return errorResponse(
      error.message || 'Failed to fetch options data. Note: Options data may not be available for all stocks.',
      500
    );
  }
}

