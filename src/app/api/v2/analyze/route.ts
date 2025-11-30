/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
// import { MasterAgent } from "@/lib/v2/agents/masterAgent";
import {
  checkRateLimit,
  getClientIp,
  errorResponse,
  successResponse,
} from "@/lib/v2/utils/apiHelpers";
import { QuerySchema } from "@/lib/v2/utils/validators";
import { AnalysisAgent } from "@/lib/v2/agents/analysisAgent";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 10, 60000)) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    // Parse and validate input
    const body = await request.json();
    const validation = QuerySchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { query } = validation.data;

    const analysisAgent = await AnalysisAgent.create();
    const result = await analysisAgent.analyze(query);

    return successResponse({
      answer: result,
      processingTime: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return errorResponse(error.message || "Failed to process query", 500);
  }
}
