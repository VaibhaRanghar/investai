import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { FundamentalsCardProps } from "@/typesV2";


export const FundamentalsCard: React.FC<FundamentalsCardProps> = ({
  metrics,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fundamental Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {metric.label}
                </p>
                {metric.previous && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Previous: {metric.previous}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-900">
                  {metric.value}
                </span>
                {metric.trend && (
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full",
                      metric.trend === "up" && "bg-green-100",
                      metric.trend === "down" && "bg-red-100",
                      metric.trend === "neutral" && "bg-gray-100"
                    )}
                  >
                    {metric.trend === "up" && (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    )}
                    {metric.trend === "down" && (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    {metric.trend === "neutral" && (
                      <Minus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                )}
                {metric.good !== undefined && (
                  <Badge
                    variant={metric.good ? "success" : "warning"}
                    size="sm"
                  >
                    {metric.good ? "Good" : "Watch"}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyFundamentalsData: FundamentalsCardProps = {
  metrics: [
    {
      label: "Revenue Growth (YoY)",
      value: "+15.2%",
      previous: "12.8%",
      trend: "up",
      good: true,
    },
    {
      label: "Profit Growth (YoY)",
      value: "+18.5%",
      previous: "14.3%",
      trend: "up",
      good: true,
    },
    {
      label: "Operating Margin",
      value: "32.5%",
      previous: "31.2%",
      trend: "up",
      good: true,
    },
    {
      label: "Return on Equity (ROE)",
      value: "22.3%",
      trend: "up",
      good: true,
    },
    { label: "Debt to Equity", value: "0.15", trend: "down", good: true },
    { label: "Current Ratio", value: "2.8", trend: "neutral", good: true },
    { label: "Interest Coverage", value: "18.5x", trend: "up", good: true },
  ],
};
