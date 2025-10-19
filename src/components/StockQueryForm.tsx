// components/StockQueryForm.tsx
"use client";

import { useState } from "react";
import { ComparisonResponse, QueryMode } from "@/types";
import StockHeader from "@/components/StockHeader";
import MetricCard from "@/components/MetricCard";
import ComparisonChart from "@/components/ComparisonChart";
import ScoreCard from "@/components/ScoreCard";

export default function StockQueryForm() {
  const [mode, setMode] = useState<QueryMode>("single");
  const [query, setQuery] = useState("");
  const [symbols, setSymbols] = useState(["", ""]);
  const [answer, setAnswer] = useState("");
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Single Stock Query Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    setComparison(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.answer || "Something went wrong. Please try again.");
        return;
      }
      setAnswer(data.answer);
      console.log("Single Stock Data:", data);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Comparison Query Handler
  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbols[0] || !symbols[1]) {
      setError("Please enter both stock symbols");
      return;
    }
    setLoading(true);
    setError("");
    setAnswer("");
    setComparison(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Comparison failed. Please try again.");
        return;
      }

      setComparison(data);
      console.log("Comparison Data:", data);
    } catch (err) {
      setError("Network error. Please check your connection and retry.");
      console.error("Compare error:", err);
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "What's Reliance stock price?",
    "How much is TCS trading at?",
    "Show me Infosys current price",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">InvestAI</h1>
              <p className="text-sm text-gray-600">
                AI-powered stock analysis for smart investors
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Switcher */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === "single"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400"
            }`}
            onClick={() => {
              setMode("single");
              setError("");
              setAnswer("");
              setComparison(null);
            }}
          >
            📊 Single Stock Analysis
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === "compare"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400"
            }`}
            onClick={() => {
              setMode("compare");
              setError("");
              setAnswer("");
              setComparison(null);
            }}
          >
            ⚖️ Compare Two Stocks
          </button>
        </div>

        {/* Single Stock Form */}
        {mode === "single" ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about any Indian stock... (e.g., 'What's Reliance price?')"
                  className="w-full px-6 py-4 text-gray-900 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Ask AI"
                  )}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Try:</span>
                {exampleQueries.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(example)}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </form>
          </div>
        ) : (
          /* Comparison Form */
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <form onSubmit={handleCompare}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock A Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TCS.NS"
                    value={symbols[0]}
                    onChange={(e) =>
                      setSymbols([
                        e.target.value.trim().toUpperCase(),
                        symbols[1],
                      ])
                    }
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock B Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., INFY.NS"
                    value={symbols[1]}
                    onChange={(e) =>
                      setSymbols([
                        symbols[0],
                        e.target.value.trim().toUpperCase(),
                      ])
                    }
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading || !symbols[0] || !symbols[1]}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Comparing...
                      </span>
                    ) : (
                      "Compare Stocks"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="animate-pulse flex gap-2">
                <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                <div className="h-3 w-3 bg-indigo-500 rounded-full animation-delay-200"></div>
                <div className="h-3 w-3 bg-indigo-500 rounded-full animation-delay-400"></div>
              </div>
              <span className="text-gray-600">
                {mode === "single"
                  ? "Analyzing stock data with AI..."
                  : "Comparing stocks with AI insights..."}
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Single Stock Answer */}
        {answer && !loading && mode === "single" && (
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div className="flex-1">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  InvestAI Analysis:
                </h3>
                <div className="text-gray-800 whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Results */}
        {comparison && !loading && mode === "compare" && (
          <div className="space-y-8 animate-fade-in">
            {/* Stock Headers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StockHeader stock={comparison.stockA} position="A" />
              <StockHeader stock={comparison.stockB} position="B" />
            </div>

            {/* Score Card */}
            <ScoreCard data={comparison} />

            {/* LLM Analysis */}
            {comparison.llmAnalysis && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 p-6 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">
                      AI Investment Insights
                    </h3>
                    <div className="text-gray-800 whitespace-pre-wrap prose prose-purple max-w-none">
                      {comparison.llmAnalysis}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Chart */}
            {comparison && <ComparisonChart data={comparison} />}

            {/* Detailed Metrics Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed Metrics Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  label="P/E Ratio"
                  valueA={comparison.stockA.peRatio}
                  valueB={comparison.stockB.peRatio}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.pe}
                  format="ratio"
                  inverse
                />
                <MetricCard
                  label="Return on Equity (ROE)"
                  valueA={comparison.stockA.roe}
                  valueB={comparison.stockB.roe}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.roe!}
                  format="percent"
                />
                <MetricCard
                  label="Net Profit Margin"
                  valueA={comparison.stockA.netProfitMargin}
                  valueB={comparison.stockB.netProfitMargin}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.margin!}
                  format="percent"
                />
                <MetricCard
                  label="Dividend Yield"
                  valueA={comparison.stockA.dividendYield}
                  valueB={comparison.stockB.dividendYield}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.dividendYield!}
                  format="percent"
                />
                <MetricCard
                  label="1-Year Return"
                  valueA={comparison.stockA.oneYearReturn}
                  valueB={comparison.stockB.oneYearReturn}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.oneYearReturn!}
                  format="percent"
                />
                <MetricCard
                  label="Earnings Per Share (EPS)"
                  valueA={comparison.stockA.eps}
                  valueB={comparison.stockB.eps}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.roe!}
                  format="currency"
                />
                <MetricCard
                  label="Book Value Per Share"
                  valueA={comparison.stockA.bookValue}
                  valueB={comparison.stockB.bookValue}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.roe!}
                  format="currency"
                />
                <MetricCard
                  label="Gross Margin"
                  valueA={comparison.stockA.grossMargin}
                  valueB={comparison.stockB.grossMargin}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.margin!}
                  format="percent"
                />
                <MetricCard
                  label="52-Week High"
                  valueA={comparison.stockA.high52w}
                  valueB={comparison.stockB.high52w}
                  symbolA={comparison.stockA.symbol}
                  symbolB={comparison.stockB.symbol}
                  winner={comparison.winnerByMetric.high52w!}
                  format="currency"
                />
              </div>
            </div>

            {/* Risk Analysis Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Risk Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-purple-700 mb-3">
                    {comparison.stockA.symbol} - {comparison.stockA.name}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        52W Volatility
                      </span>
                      <span className="text-sm font-medium">
                        {(
                          ((comparison.stockA.high52w -
                            comparison.stockA.low52w) /
                            comparison.stockA.low52w) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Debt/Equity</span>
                      <span className="text-sm font-medium">
                        {comparison.stockA.debtToEquity !== null
                          ? comparison.stockA.debtToEquity.toFixed(2)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-700 mb-3">
                    {comparison.stockB.symbol} - {comparison.stockB.name}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        52W Volatility
                      </span>
                      <span className="text-sm font-medium">
                        {(
                          ((comparison.stockB.high52w -
                            comparison.stockB.low52w) /
                            comparison.stockB.low52w) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Debt/Equity</span>
                      <span className="text-sm font-medium">
                        {comparison.stockB.debtToEquity !== null
                          ? comparison.stockB.debtToEquity.toFixed(2)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!answer && !comparison && !loading && !error && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mode === "single" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                )}
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {mode === "single" ? "Ask About Any Stock" : "Compare Two Stocks"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {mode === "single"
                ? "Enter a question about any Indian stock to get AI-powered insights and analysis."
                : "Enter two stock symbols to compare their performance, fundamentals, and key metrics side-by-side with AI insights."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
