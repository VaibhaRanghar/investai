import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Globe, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { GiftNiftyWidgetProps } from "@/typesV2";

export const GiftNiftyWidget: React.FC<GiftNiftyWidgetProps> = ({
  value,
  change,
  changePercent,
  niftyClose,
  timestamp,
}) => {
  const gap = value - niftyClose;
  const isGapUp = gap > 0;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">GIFT Nifty</h3>
          </div>
          <Badge variant="info" size="sm">
            After Hours
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {value.toLocaleString()}
            </span>
            <span
              className={cn(
                "flex items-center text-sm font-semibold",
                change >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)} ({change >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="pt-2 border-t border-indigo-200">
            <p className="text-xs text-gray-600 mb-1">Expected Opening</p>
            <div className="flex items-center space-x-2">
              {isGapUp ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={cn(
                  "text-sm font-semibold",
                  isGapUp ? "text-green-600" : "text-red-600"
                )}
              >
                Gap {isGapUp ? "Up" : "Down"}: {Math.abs(gap).toFixed(2)} points
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Updated: {timestamp}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyGiftNiftyData: GiftNiftyWidgetProps = {
  value: 25230,
  change: -172,
  changePercent: -0.68,
  niftyClose: 25285.35,
  timestamp: "11-Oct-2025 2:01 AM",
};
