import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResultsCardProps } from "@/typesV2";

export const FinancialResultsCard: React.FC<FinancialResultsCardProps> = ({
  results,
  growthRates,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Financial Results</CardTitle>
          <button className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Growth Summary */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b">
          <GrowthMetric
            label="Revenue Growth"
            value={growthRates.revenueGrowth}
          />
          <GrowthMetric
            label="Profit Growth"
            value={growthRates.profitGrowth}
          />
          <GrowthMetric label="EPS Growth" value={growthRates.epsGrowth} />
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 text-gray-600 font-semibold">
                  Period
                </th>
                <th className="text-right py-3 text-gray-600 font-semibold">
                  Revenue (₹Cr)
                </th>
                <th className="text-right py-3 text-gray-600 font-semibold">
                  Profit (₹Cr)
                </th>
                <th className="text-right py-3 text-gray-600 font-semibold">
                  EPS (₹)
                </th>
                <th className="text-right py-3 text-gray-600 font-semibold">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 font-medium text-gray-900">
                    {result.period}
                  </td>
                  <td className="text-right py-3 text-gray-900">
                    {result.revenue.toFixed(2)}
                  </td>
                  <td className="text-right py-3 text-gray-900">
                    {result.profit.toFixed(2)}
                  </td>
                  <td className="text-right py-3 font-semibold text-gray-900">
                    {result.eps.toFixed(2)}
                  </td>
                  <td className="text-right py-3">
                    <Badge
                      variant={result.margin > 25 ? "success" : "neutral"}
                      size="sm"
                    >
                      {result.margin.toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Highlights */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Key Highlights
          </h4>
          <div className="space-y-2">
            <HighlightItem
              text="Revenue increased by 15.2% YoY, driven by strong demand"
              positive
            />
            <HighlightItem
              text="Profit margin improved from 25.3% to 27.1%"
              positive
            />
            <HighlightItem
              text="EPS grew consistently across last 4 quarters"
              positive
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GrowthMetric: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => {
  const isPositive = value >= 0;

  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center justify-center space-x-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
        <span
          className={cn(
            "text-lg font-bold",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? "+" : ""}
          {value.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

const HighlightItem: React.FC<{ text: string; positive?: boolean }> = ({
  text,
  positive = true,
}) => {
  return (
    <div className="flex items-start space-x-2">
      <span className="text-lg">{positive ? "✅" : "⚠️"}</span>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
};

export const dummyFinancialResultsData: FinancialResultsCardProps = {
  results: [
    {
      period: "Q1 2025 (Jun)",
      revenue: 1220.42,
      profit: 330.45,
      eps: 4.13,
      margin: 27.1,
    },
    {
      period: "Q4 2024 (Mar)",
      revenue: 1329.74,
      profit: 357.95,
      eps: 4.47,
      margin: 26.9,
    },
    {
      period: "Q3 2024 (Dec)",
      revenue: 1281.0,
      profit: 341.21,
      eps: 4.27,
      margin: 26.6,
    },
    {
      period: "Q2 2024 (Sep)",
      revenue: 1123.77,
      profit: 307.82,
      eps: 3.85,
      margin: 27.4,
    },
    {
      period: "Q1 2024 (Jun)",
      revenue: 1171.5,
      profit: 307.68,
      eps: 3.85,
      margin: 26.3,
    },
  ],
  growthRates: {
    revenueGrowth: 4.2,
    profitGrowth: 7.4,
    epsGrowth: 7.3,
  },
};
