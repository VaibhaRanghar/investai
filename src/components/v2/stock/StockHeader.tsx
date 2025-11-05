import React from "react";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/utils";
import { StockHeaderProps } from "@/typesV2";

export const StockHeader: React.FC<StockHeaderProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  sector,
  indices = [],
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl p-8 shadow-lg">
      <div className="flex items-start justify-between md:flex-row flex-col">
        <div className="flex-1 ">
          <div className="flex items-start space-x-3 mb-2 md:flex-row flex-col ">
            <h1 className="text-4xl font-bold">{symbol}</h1>
            {sector && (
              <Badge
                variant="info"
                className="bg-white/20 text-white border-white/30"
              >
                {sector}
              </Badge>
            )}
          </div>
          <p className="text-indigo-100 text-lg mb-4">{name}</p>

          {indices.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {indices.slice(0, 5).map((index) => (
                <Badge
                  key={index}
                  variant="neutral"
                  size="sm"
                  className="bg-white/10 text-white border-white/20"
                >
                  {index}
                </Badge>
              ))}
              {indices.length > 5 && (
                <Badge
                  variant="neutral"
                  size="sm"
                  className="bg-white/10 text-white border-white/20"
                >
                  +{indices.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-5xl font-bold mb-2">₹{price.toFixed(2)}</div>
          <div
            className={cn(
              "flex items-center justify-end space-x-2 text-lg font-semibold",
              isPositive ? "text-green-300" : "text-red-300"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span>
              {isPositive ? "+" : ""}₹{change.toFixed(2)} (
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy data for testing
export const dummyStockHeaderData: StockHeaderProps = {
  symbol: "IRCTC",
  name: "Indian Railway Catering And Tourism Corporation Limited",
  price: 715.0,
  change: 5.2,
  changePercent: 0.73,
  sector: "Tour Travel Related Services",
  indices: [
    "NIFTY MIDCAP 50",
    "NIFTY 200",
    "NIFTY 500",
    "NIFTY PSE",
    "NIFTY TRANSPORTATION",
  ],
};
