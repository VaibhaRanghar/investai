"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/v2/ui/Button";
import { Input } from "@/components/v2/ui/Input";
import { MarketStatusBanner } from "@/components/v2/market/MarketStatusBanner";
import { useMarketStatus } from "@/hooks/v2/useMarketStatus";
import { useStockAnalysis } from "@/hooks/v2/useStockAnalysis";
import { Search, TrendingUp, BarChart3, Newspaper } from "lucide-react";
import Link from "next/link";

export default function HomeV2() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { marketStatus, loading: marketLoading } = useMarketStatus();
  console.log("marketStatus", marketStatus);
  const {
    analysis,
    loading: analysisLoading,
    error,
    analyze,
  } = useStockAnalysis();
  const handleSearch = async () => {
    if (!query.trim()) return;

    // Check if it's a single stock symbol (navigate to detail page)
    const symbolMatch = query.match(/^[A-Z]{2,10}$/i);
    if (symbolMatch) {
      router.push(`/v2/stock/${query.toUpperCase()}`);
      return;
    }

    // Otherwise, analyze with AI
    await analyze(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Status */}
        {!marketLoading && marketStatus && (
          <div className="mb-8">
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

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Stock Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get intelligent insights on NSE stocks powered by advanced AI.
            Analyze fundamentals, compare stocks, and make informed investment
            decisions.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex space-x-2">
              <Input
                placeholder='Ask anything... e.g., "Analyze IRCTC" or "Compare IRCTC vs RVNL"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                icon={<Search className="w-5 h-5" />}
                className="text-lg"
              />
              <Button
                variant="primary"
                size="lg"
                onClick={handleSearch}
                loading={analysisLoading}
                disabled={!query.trim()}
              >
                Analyze
              </Button>
            </div>
          </div>

          {/* Analysis Result */}
          {analysis && (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Analysis Result
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                  {analysis}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Stock Analysis"
            description="Comprehensive analysis of price, fundamentals, and AI-powered recommendations"
            href="/v2/"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Stock Comparison"
            description="Side-by-side comparison with winner determination and investment advice"
            href="/v2/compare"
          />
          <FeatureCard
            icon={<Newspaper className="w-8 h-8" />}
            title="Market News"
            description="Latest announcements, corporate actions, and market movers"
            href="/v2/news"
          />
        </div>

        {/* Popular Stocks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Stocks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "IRCTC",
              "RVNL",
              "RITES",
              "TCS",
              "INFY",
              "RELIANCE",
              "HDFCBANK",
              "ICICIBANK",
            ].map((symbol) => (
              <Link
                key={symbol}
                href={`/v2/stock/${symbol}`}
                className="px-4 py-2 text-center border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors font-medium text-gray-700"
              >
                {symbol}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}> = ({ icon, title, description, href }) => {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};
