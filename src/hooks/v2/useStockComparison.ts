/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { apiClient } from "@/lib/v2/api/client";

export function useStockComparison() {
  const [comparison, setComparison] = useState<any>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (symbol1: string, symbol2: string) => {
    setLoading(true);
    setError(null);
    setComparison(null);
    setInsights(null);

    const result = await apiClient.compareStocks(symbol1, symbol2);
    console.log("useCompare result:", result);
    if (result.success) {
      setComparison(result.data?.comparison || null);
      setInsights(result.data?.insights || null);
    } else {
      setError(result.error || "Comparison failed");
    }

    setLoading(false);
  };

  const reset = () => {
    setComparison(null);
    setInsights(null);
    setError(null);
  };

  return { comparison, insights, loading, error, compare, reset };
}
