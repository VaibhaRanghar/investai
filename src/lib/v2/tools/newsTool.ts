/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { cacheService } from "../services/cacheService";
import { nseService } from "@/lib/services/nseService";

export const newsTool = new DynamicStructuredTool({
  name: "get_news",
  description: "Get latest corporate announcements and news for a stock",
  schema: z.object({
    symbol: z.string().describe("Stock symbol to get news for"),
  }),
  func: async ({ symbol }) => {
    try {
      const cacheKey = `news:${symbol}`;
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;

      const corporateInfo = await nseService.getEquityCorporateInfo(symbol);

      const latestNews =
        corporateInfo.latest_announcements?.data?.slice(0, 5).map((item) => ({
          date: item.broadcastdate,
          subject: item.subject,
        })) || [];

      const recentActions =
        corporateInfo.corporate_actions?.data?.slice(0, 3).map((item) => ({
          date: item.exdate,
          purpose: item.purpose,
        })) || [];

      const upcomingMeetings =
        corporateInfo.borad_meeting?.data?.slice(0, 3).map((item) => ({
          date: item.meetingdate,
          purpose: item.purpose,
        })) || [];

      const newsData = {
        symbol,
        latestAnnouncements:
          latestNews.length > 0 ? latestNews : "No recent announcements",
        corporateActions:
          recentActions.length > 0
            ? recentActions
            : "No recent corporate actions",
        upcomingMeetings:
          upcomingMeetings.length > 0
            ? upcomingMeetings
            : "No upcoming meetings",
      };

      const result = JSON.stringify(newsData, null, 2);
      cacheService.set(cacheKey, result, cacheService.getTTL("CORPORATE"));

      return result;
    } catch (error: any) {
      return `Error fetching news for ${symbol}: ${error.message}`;
    }
  },
});
