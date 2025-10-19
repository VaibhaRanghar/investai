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
