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
import { Metric } from "@/typesV2";

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

  // console.log("[StockDetailPage] Render:", {
  //   symbol,
  //   hasData: !!stockData,
  //   stockLoading,
  //   stockError,
  // });

  // Trigger AI analysis when stock data loads
  React.useEffect(() => {
    if (stockData && !analysis && !analysisLoading) {
      analyze(`Analyze ${symbol} stock comprehensively`);
    }
  }, [symbol, analysis, analysisLoading, stockData]);

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

  // Prepare data for components
  const stockHeaderData = {
    symbol: equity.info.symbol,
    name: equity.info.companyName,
    price: equity.priceInfo.lastPrice,
    change: equity.priceInfo.change,
    changePercent: equity.priceInfo.pChange,
    sector: equity.metadata.industry,
    indices: equity.metadata.pdSectorIndAll?.slice(0, 5) || [
      equity.metadata.pdSectorInd,
    ],
  };

  const priceData = {
    open: equity.priceInfo.open,
    high: equity.priceInfo.intraDayHighLow.max,
    low: equity.priceInfo.intraDayHighLow.min,
    previousClose: equity.priceInfo.previousClose,
    vwap: equity.priceInfo.vwap,
    volume: trade?.marketDeptOrderBook?.tradeInfo?.totalTradedVolume || 0,
    high52w: equity.priceInfo.weekHighLow.max,
    low52w: equity.priceInfo.weekHighLow.min,
  };

  const metricsData = [
    {
      label: "P/E Ratio",
      value: equity.metadata.pdSymbolPe?.toFixed(2) || "N/A",
      subValue: `Sector: ${equity.metadata.pdSectorPe?.toFixed(2) || "N/A"}`,
      variant:
        equity.metadata.pdSymbolPe < equity.metadata.pdSectorPe
          ? "success"
          : "neutral",
      badge:
        equity.metadata.pdSymbolPe < equity.metadata.pdSectorPe
          ? "Fair Value"
          : undefined,
    },
    {
      label: "Market Cap",
      value: trade
        ? `₹${(
            trade.marketDeptOrderBook.tradeInfo.totalMarketCap / 100
          ).toFixed(0)} Cr`
        : "N/A",
      subValue: "Mid Cap",
    },
    {
      label: "EPS",
      value: equity.securityInfo.eps
        ? `₹${equity.securityInfo.eps.toFixed(2)}`
        : "N/A",
      subValue: "TTM",
    },
    {
      label: "Book Value",
      value: equity.securityInfo.bookValue
        ? `₹${equity.securityInfo.bookValue.toFixed(2)}`
        : "N/A",
      subValue: "Per Share",
    },
    {
      label: "Dividend Yield",
      value: equity.securityInfo.dividendYield
        ? `${equity.securityInfo.dividendYield.toFixed(2)}%`
        : "N/A",
      variant: equity.securityInfo.dividendYield > 1 ? "success" : "neutral",
    },
    {
      label: "Delivery %",
      value: trade
        ? `${trade.securityWiseDP.deliveryToTradedQuantity.toFixed(2)}%`
        : "N/A",
      variant:
        trade?.securityWiseDP.deliveryToTradedQuantity > 60
          ? "success"
          : "neutral",
    },
  ] as Metric[];

  const range52Data = {
    current: equity.priceInfo.lastPrice,
    low: equity.priceInfo.weekHighLow.min,
    high: equity.priceInfo.weekHighLow.max,
    lowDate: equity.priceInfo.weekHighLow.minDate,
    highDate: equity.priceInfo.weekHighLow.maxDate,
  };

  console.log("Analysis data in page= ", analysis);
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
