"use client";

import React, { use } from "react";
import { useStockData } from "@/hooks/v2/useStockData";
import { useStockAnalysis } from "@/hooks/v2/useStockAnalysis";
import { useMarketStatus } from "@/hooks/v2/useMarketStatus";
import { Tabs } from "@/components/v2/ui/Tabs";
import { StockHeader } from "@/components/v2/stock/StockHeader";
import { PriceCard } from "@/components/v2/stock/PriceCard";
import { MetricsGrid } from "@/components/v2/stock/MetricsGrid";
import { AIInsightsCard } from "@/components/v2/stock/AIInsightsCard";
import { MarketStatusBanner } from "@/components/v2/market/MarketStatusBanner";
import { CardSkeleton } from "@/components/v2/ui/LoadingSkeleton";
import {
  TrendingUp,
  BarChart2,
  FileText,
  Users,
  DollarSign,
} from "lucide-react";
import { Range52WeekCard } from "@/components/v2/analysis/Range52WeekCard";
import { ParsedToMetricsData } from "@/lib/v2/utils/dataParser";

export default function StockDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const symbol = slug;
  const {
    data: stockData,
    loading: stockLoading,
    error: stockError,
  } = useStockData(symbol?.toUpperCase());
  const { marketStatus } = useMarketStatus();
  const { analysis, loading: analysisLoading, analyze } = useStockAnalysis();

  // Trigger AI analysis when stock data loads
  React.useEffect(() => {
    if (stockData && !analysis && !analysisLoading) {
      analyze(`Analyze ${symbol} stock comprehensively`);
    }
  }, [symbol, analysis, analysisLoading, stockData, analyze]);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "fundamentals",
      label: "Fundamentals",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      id: "financials",
      label: "Financials",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "shareholding",
      label: "Shareholding",
      icon: <Users className="w-4 h-4" />,
    },
    { id: "news", label: "News", icon: <FileText className="w-4 h-4" /> },
  ];

  if (stockError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{stockError}</p>
        </div>
      </div>
    );
  }

  if (stockLoading || !stockData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const { equity, trade, corporate } = stockData;
  const { metricsData, priceData, range52Data, stockHeaderData } =
    ParsedToMetricsData(equity, trade, corporate);
  console.log("Analysis data in page= ", analysis);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Status */}
        {marketStatus && (
          <div className="mb-6">
            <MarketStatusBanner
              isOpen={marketStatus.marketState[0]?.marketStatus === "Open"}
              niftyValue={marketStatus.marketState[0]?.last || 0}
              niftyChange={marketStatus.marketState[0]?.variation || 0}
              niftyChangePercent={
                marketStatus.marketState[0]?.percentChange || 0
              }
              timestamp={marketStatus.marketState[0]?.tradeDate || ""}
              giftNifty={
                marketStatus.giftnifty
                  ? {
                      value: marketStatus.giftnifty.LASTPRICE,
                      change: parseFloat(marketStatus.giftnifty.DAYCHANGE),
                    }
                  : undefined
              }
            />
          </div>
        )}

        {/* Stock Header */}
        <div className="mb-6">
          <StockHeader {...stockHeaderData} />
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="overview">
          {(activeTab) => (
            <>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* AI Insights */}
                  {analysis ? (
                    <AIInsightsCard
                      analysis={analysis}
                      recommendation="HOLD"
                      confidence={78}
                      insights={[
                        {
                          type: "positive",
                          category: "Valuation",
                          message: "Fair P/E ratio compared to sector average",
                        },
                      ]}
                      loading={false}
                    />
                  ) : (
                    <AIInsightsCard
                      analysis=""
                      recommendation="HOLD"
                      confidence={0}
                      insights={[]}
                      loading={analysisLoading}
                    />
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PriceCard {...priceData} />
                    <Range52WeekCard {...range52Data} />
                  </div>

                  <MetricsGrid metrics={metricsData} />
                </div>
              )}

              {activeTab === "fundamentals" && (
                <div className="text-center py-12 text-gray-500">
                  Fundamentals section - Coming soon
                </div>
              )}

              {activeTab === "financials" && (
                <div className="text-center py-12 text-gray-500">
                  Financials section - Coming soon
                </div>
              )}

              {activeTab === "shareholding" && (
                <div className="text-center py-12 text-gray-500">
                  Shareholding section - Coming soon
                </div>
              )}

              {activeTab === "news" && (
                <div className="text-center py-12 text-gray-500">
                  News section - Coming soon
                </div>
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
