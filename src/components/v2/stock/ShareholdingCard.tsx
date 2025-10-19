import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ShareholdingCardProps } from "@/typesV2";


export const ShareholdingCard: React.FC<ShareholdingCardProps> = ({
  current,
  previous,
  history,
}) => {
  const getTrend = (current: number, previous: number) => {
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "neutral";
  };

  const promoterTrend = getTrend(current.promoter, previous.promoter);
  const promoterChange = (current.promoter - previous.promoter).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shareholding Pattern</CardTitle>
        <p className="text-sm text-gray-500 mt-1">As of {current.quarter}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart Representation */}
        <div className="relative">
          <div className="flex h-12 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${current.promoter}%` }}
            >
              {current.promoter > 15 && `${current.promoter}%`}
            </div>
            <div
              className="bg-purple-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${current.institutional}%` }}
            >
              {current.institutional > 15 && `${current.institutional}%`}
            </div>
            <div
              className="bg-gray-400 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${current.public}%` }}
            >
              {current.public > 15 && `${current.public}%`}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <ShareholdingItem
            label="Promoter Holding"
            value={current.promoter}
            trend={promoterTrend}
            change={promoterChange}
            color="bg-indigo-600"
          />
          <ShareholdingItem
            label="Institutional"
            value={current.institutional}
            color="bg-purple-500"
          />
          <ShareholdingItem
            label="Public"
            value={current.public}
            color="bg-gray-400"
          />
        </div>

        {/* Trend Analysis */}
        <div className="pt-4 border-t">
          {promoterTrend === "neutral" ? (
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Badge variant="success">Stable</Badge>
              <span className="text-sm text-green-800 font-medium">
                No change in promoter holding for last {history.length} quarters
              </span>
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center justify-center space-x-2 p-3 rounded-lg border",
                promoterTrend === "up" && "bg-green-50 border-green-200",
                promoterTrend === "down" && "bg-red-50 border-red-200"
              )}
            >
              <Badge variant={promoterTrend === "up" ? "success" : "warning"}>
                {promoterTrend === "up" ? "Increased" : "Decreased"}
              </Badge>
              <span
                className={cn(
                  "text-sm font-medium",
                  promoterTrend === "up" ? "text-green-800" : "text-red-800"
                )}
              >
                Promoter holding{" "}
                {promoterTrend === "up" ? "increased" : "decreased"} by{" "}
                {Math.abs(parseFloat(promoterChange))}%
              </span>
            </div>
          )}
        </div>

        {/* Historical Table */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Historical Trend
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600 font-medium">
                    Quarter
                  </th>
                  <th className="text-right py-2 text-gray-600 font-medium">
                    Promoter
                  </th>
                  <th className="text-right py-2 text-gray-600 font-medium">
                    Institutional
                  </th>
                  <th className="text-right py-2 text-gray-600 font-medium">
                    Public
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">{item.quarter}</td>
                    <td className="text-right py-2 font-semibold text-gray-900">
                      {item.promoter}%
                    </td>
                    <td className="text-right py-2 text-gray-700">
                      {item.institutional}%
                    </td>
                    <td className="text-right py-2 text-gray-700">
                      {item.public}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ShareholdingItem: React.FC<{
  label: string;
  value: number;
  trend?: "up" | "down" | "neutral";
  change?: string;
  color: string;
}> = ({ label, value, trend, change, color }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-4 h-4 rounded ${color}`} />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-base font-bold text-gray-900">{value}%</span>
        {trend && change && (
          <div className="flex items-center text-xs">
            {trend === "up" && (
              <TrendingUp className="w-3 h-3 text-green-600" />
            )}
            {trend === "down" && (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            {trend === "neutral" && <Minus className="w-3 h-3 text-gray-600" />}
            <span
              className={cn(
                "ml-1",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-gray-600"
              )}
            >
              {change !== "0.00" && (trend === "up" ? "+" : "")}
              {change}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const dummyShareholdingData: ShareholdingCardProps = {
  current: {
    quarter: "Jun 2025",
    promoter: 62.4,
    public: 30.1,
    institutional: 7.5,
  },
  previous: {
    quarter: "Mar 2025",
    promoter: 62.4,
    public: 30.1,
    institutional: 7.5,
  },
  history: [
    { quarter: "Jun 2025", promoter: 62.4, public: 30.1, institutional: 7.5 },
    { quarter: "Mar 2025", promoter: 62.4, public: 30.1, institutional: 7.5 },
    { quarter: "Dec 2024", promoter: 62.4, public: 30.1, institutional: 7.5 },
    { quarter: "Sep 2024", promoter: 62.4, public: 30.1, institutional: 7.5 },
    { quarter: "Jun 2024", promoter: 62.4, public: 30.1, institutional: 7.5 },
  ],
};
