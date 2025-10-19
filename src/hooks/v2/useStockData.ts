/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/v2/api/client";

export function useStockData(symbol: string | null) {
  console.log("symbol in usestockData:", symbol);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const result = await apiClient.getStock(symbol);
      console.log("UseStockData:", result);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch stock data");
      }

      setLoading(false);
    };

    fetchData();
  }, [symbol]);

  return { data, loading, error };
}
