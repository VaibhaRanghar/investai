/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
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
    if (!checkRateLimit(ip, 20, 60000)) {
      return errorResponse('Too many requests. Please try again later.', 429);
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return errorResponse('Symbol parameter is required', 400);
    }

    const corporateInfo = await nseService.getEquityCorporateInfo(symbol);

    return successResponse({
      announcements: corporateInfo.latest_announcements?.data || [],
      corporateActions: corporateInfo.corporate_actions?.data || [],
      meetings: corporateInfo.borad_meeting?.data || [],
      financialResults: corporateInfo.financial_results?.data || [],
    });
  } catch (error: any) {
    console.error('News API Error:', error);
    return errorResponse(error.message || 'Failed to fetch news', 500);
  }
}
