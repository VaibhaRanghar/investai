/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/v2/api/client";

export function useMarketStatus() {
  const [marketStatus, setMarketStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      const result = await apiClient.getMarketStatus();
      if (result.success && result.data) {
        setMarketStatus(result.data);
      }
      setLoading(false);
    };

    fetchMarketStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketStatus, 30000);

    return () => clearInterval(interval);
  }, []);
  return { marketStatus, loading };
}
