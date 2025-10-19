// app/lib/utils/apiHelpers.ts

// In-memory rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

export function getClientIP(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown"
  );
}

export function createRateLimitResponse() {
  return Response.json(
    {
      error: "Rate limit exceeded. Please wait a minute before trying again.",
      success: false,
    },
    { status: 429 }
  );
}

export function createErrorResponse(message: string, status = 500) {
  return Response.json(
    {
      error: message,
      success: false,
    },
    { status }
  );
}
