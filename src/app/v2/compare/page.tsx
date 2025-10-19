"use client";

import React, { useEffect, useState } from "react";
import { useStockComparison } from "@/hooks/v2/useStockComparison";
import { useMarketStatus } from "@/hooks/v2/useMarketStatus";
import { Button } from "@/components/v2/ui/Button";
import { StockSearchInput } from "@/components/v2/forms/StockSearchInput";
import { ComparisonTable } from "@/components/v2/comparison/ComparisonTable";
import { WinnerCard } from "@/components/v2/comparison/WinnerCard";
import { AIInsightsCard } from "@/components/v2/stock/AIInsightsCard";
import { MarketStatusBanner } from "@/components/v2/market/MarketStatusBanner";
import { ArrowRight, BarChart3 } from "lucide-react";

export default function ComparePage() {
  const [stock1, setStock1] = useState("");
  const [stock2, setStock2] = useState("");
  const { comparison, insights, loading, error, compare } =
    useStockComparison();
  const { marketStatus } = useMarketStatus();
  const handleCompare = () => {
    if (stock1 && stock2) {
      compare(stock1.toUpperCase(), stock2.toUpperCase());
    }
  };
  console.log("Comparision", comparison);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Status */}
        {marketStatus && (
          <div className="mb-6">
            <MarketStatusBanner
              isOpen={marketStatus.marketState[0]?.marketStatus === "Open"}
              niftyValue={marketStatus.indicativenifty50?.closingValue || 0}
              niftyChange={marketStatus.indicativenifty50?.change || 0}
              niftyChangePercent={
                marketStatus.indicativenifty50?.perChange || 0
              }
              timestamp={marketStatus.marketState[0]?.tradeDate || ""}
            />
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Compare Stocks</h1>
          </div>
          <p className="text-lg text-gray-600">
            Compare two stocks side-by-side with AI-powered analysis
          </p>
        </div>

        {/* Comparison Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Stock
              </label>
              <StockSearchInput
                onSelect={setStock1}
                placeholder="Enter symbol (e.g., IRCTC)"
              />
              {stock1 && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <strong>{stock1}</strong>
                </p>
              )}
            </div>

            <div className="flex items-center justify-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Stock
              </label>
              <StockSearchInput
                onSelect={setStock2}
                placeholder="Enter symbol (e.g., RVNL)"
              />
              {stock2 && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <strong>{stock2}</strong>
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleCompare}
              disabled={!stock1 || !stock2 || loading}
              loading={loading}
              size="lg"
            >
              Compare Stocks
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {comparison && insights && (
          <div className="space-y-6">
            {/* AI Analysis */}
            <AIInsightsCard
              analysis={insights}
              recommendation="HOLD"
              confidence={80}
              insights={[]}
              loading={false}
            />

            {/* Comparison Table (if you build it with real data) */}
            {/* <ComparisonTable ... /> */}
          </div>
        )}
      </div>
    </div>
  );
}
