import React from "react";
import { Card, CardContent } from "../ui/Card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { IndexWidgetProps } from "@/typesV2";



export const IndexWidget: React.FC<IndexWidgetProps> = ({ indices }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Major Indices
        </h3>
        <div className="space-y-3">
          {indices.map((index, idx) => {
            const isPositive = index.change >= 0;
            return (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {index.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {index.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-1 text-sm font-semibold",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyIndicesData: IndexWidgetProps = {
  indices: [
    { name: "NIFTY 50", value: 25285.35, change: 103.55, changePercent: 0.41 },
    {
      name: "NIFTY BANK",
      value: 52134.8,
      change: -125.3,
      changePercent: -0.24,
    },
    { name: "NIFTY IT", value: 35687.2, change: 245.6, changePercent: 0.69 },
    { name: "NIFTY MIDCAP", value: 12456.7, change: 87.4, changePercent: 0.71 },
  ],
};
