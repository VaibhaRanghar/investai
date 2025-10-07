"use client";
import { useState } from "react";

export default function StockQueryForm() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

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
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Error:", err);
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
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about any Indian stock... (e.g., 'What's Reliance price?')"
            className="w-full px-6 py-4 text-gray-900 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none shadow-lg"
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

        {/* Example Queries */}
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

      {/* Loading State */}
      {loading && (
        <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="animate-pulse flex gap-2">
              <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
              <div className="h-3 w-3 bg-indigo-500 rounded-full animation-delay-200"></div>
              <div className="h-3 w-3 bg-indigo-500 rounded-full animation-delay-400"></div>
            </div>
            <span className="text-gray-600">Analyzing stock data...</span>
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

      {/* Answer Display */}
      {answer && !loading && (
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 mb-2">
                InvestAI Says:
              </h3>
              <div className="text-gray-800 whitespace-pre-wrap">{answer}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
