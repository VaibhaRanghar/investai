/* eslint-disable @typescript-eslint/no-explicit-any */
import { EquityHistoricalData } from "stock-nse-india/build/interface";
import { z } from "zod";

export const StockSymbolSchema = z
  .string()
  .min(1)
  .max(20)
  .regex(/^[A-Z0-9&-]+$/, "Invalid stock symbol format")
  .transform((val) => val.toUpperCase());

export const ComparisonSchema = z.object({
  symbols: z.array(StockSymbolSchema).length(2, "Exactly 2 symbols required"),
});

export const QuerySchema = z.object({
  query: z.string().min(1, "Query cannot be empty").max(500, "Query too long"),
});

export const DateRangeSchema = z
  .object({
    start: z.date(),
    end: z.date(),
  })
  .refine((data) => data.end > data.start, {
    message: "End date must be after start date",
  });

export function validateStockSymbol(symbol: string): {
  valid: boolean;
  error?: string;
} {
  const result = StockSymbolSchema.safeParse(symbol);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, error: result.error.errors[0].message };
}

export function safeNum(val: any, decimals = 2, fallback = "N/A") {
  if (val === null || val === undefined) return fallback;
  // Remove whitespace and check for string placeholders
  if (
    typeof val === "string" &&
    ["NA", "N/A", "-", ""].includes(val.trim().toUpperCase())
  )
    return fallback;
  const num = typeof val === "number" ? val : Number(val);
  if (isNaN(num)) return fallback;
  return num.toFixed(decimals);
}

export function safePercent(val: any, fallback = "N/A") {
  const x = safeNum(val, 2, "");
  return x !== null ? `${x}%` : fallback;
}

export function enoughHistory(
  histObj: EquityHistoricalData,
  minPoints: number
) {
  if (!histObj || !Array.isArray(histObj.data)) return false;
  return histObj.data.length >= minPoints;
}
