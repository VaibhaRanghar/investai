// components/ComparisonChart.tsx
"use client";

import { ComparisonResponse } from "@/types";

interface ComparisonChartProps {
  data: ComparisonResponse;
}

export default function ComparisonChart({ data }: ComparisonChartProps) {
  const metrics = [
    // {
    //   label: "ROE",
    //   valueA: data.stockA.roe / 100,
    //   valueB: data.stockB.roe / 100,
    //   winner: data.winnerByMetric.roe,
    //   suffix: "%",
    // },
    // {
    //   label: "Net Margin",
    //   valueA: data.stockA.netProfitMargin / 100,
    //   valueB: data.stockB.netProfitMargin / 100,
    //   winner: data.winnerByMetric.margin,
    //   suffix: "%",
    // },
    // {
    //   label: "Gross Margin",
    //   valueA: data.stockA.grossMargin / 100,
    //   valueB: data.stockB.grossMargin / 100,
    //   winner: data.winnerByMetric.margin,
    //   suffix: "%",
    // },
    {
      label: "Dividend Yield",
      valueA: data.stockA.dividendYield / 100,
      valueB: data.stockB.dividendYield / 100,
      winner: data.winnerByMetric.dividendYield,
      suffix: "%",
    },
    {
      label: "1Y Return",
      valueA: data.stockA.oneYearReturn,
      valueB: data.stockB.oneYearReturn,
      winner: data.winnerByMetric.oneYearReturn,
      suffix: "%",
    },
  ];

  const getBarWidth = (value: number, maxValue: number) => {
    if (maxValue === 0) return 0;
    return Math.abs((value / maxValue) * 100);
  };

  const getMaxValue = (valueA: number, valueB: number) => {
    const max = Math.max(Math.abs(valueA), Math.abs(valueB));
    return max === 0 ? 1 : max;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Performance Comparison
      </h3>

      <div className="space-y-6">
        {metrics.map((metric, index) => {
          const maxValue = getMaxValue(metric.valueA, metric.valueB);
          const widthA = getBarWidth(metric.valueA, maxValue);
          const widthB = getBarWidth(metric.valueB, maxValue);
          const isNegativeA = metric.valueA < 0;
          const isNegativeB = metric.valueB < 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {metric.label}
                </span>
                {metric.winner !== "Tie" && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      metric.winner === "A"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {metric.winner === "A"
                      ? data.stockA.symbol
                      : data.stockB.symbol}
                  </span>
                )}
              </div>

              {/* Stock A Bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-purple-700 w-12 text-right">
                  {data.stockA.symbol}
                </span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`absolute top-0 ${
                      isNegativeA
                        ? "right-0 bg-red-400"
                        : "left-0 bg-purple-500"
                    } h-full transition-all duration-500 flex items-center justify-end px-2`}
                    style={{ width: `${widthA}%` }}
                  >
                    <span className="text-xs font-semibold text-white">
                      {metric.valueA.toFixed(2)}
                      {metric.suffix}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock B Bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-indigo-700 w-12 text-right">
                  {data.stockB.symbol}
                </span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`absolute top-0 ${
                      isNegativeB
                        ? "right-0 bg-red-400"
                        : "left-0 bg-indigo-500"
                    } h-full transition-all duration-500 flex items-center justify-end px-2`}
                    style={{ width: `${widthB}%` }}
                  >
                    <span className="text-xs font-semibold text-white">
                      {metric.valueB.toFixed(2)}
                      {metric.suffix}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
