import { useState } from "react";
import { apiClient } from "@/lib/v2/api/client";

export function useStockAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (query: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const result = await apiClient.analyze(query);
    console.log("UseAnalysis:", result);
    if (result.success) {
      const answer = result.answer;
      setAnalysis(answer || null);
    } else {
      setError(result.error || "Analysis failed");
    }

    setLoading(false);
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return { analysis, loading, error, analyze, reset };
}
