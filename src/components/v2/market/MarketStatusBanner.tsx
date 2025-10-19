import React from "react";
import { Badge } from "../ui/Badge";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { MarketStatusBannerProps } from "@/typesV2";

export const MarketStatusBanner: React.FC<MarketStatusBannerProps> = ({
  isOpen,
  niftyValue,
  niftyChange,
  niftyChangePercent,
  timestamp,
  giftNifty,
}) => {
  const isPositive = niftyChange >= 0;

  return (
    <div
      className={cn(
        "rounded-lg p-4 shadow-sm border-l-4",
        isOpen ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Badge variant={isOpen ? "success" : "danger"} size="lg">
            <Clock className="w-4 h-4 mr-1" />
            {isOpen ? "MARKET OPEN" : "MARKET CLOSED"}
          </Badge>
          <span className="text-sm text-gray-600">{timestamp}</span>
        </div>

        <div className="flex items-center space-x-6">
          {/* NIFTY 50 */}
          <div>
            <p className="text-xs text-gray-500 mb-0.5">NIFTY 50</p>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {niftyValue.toLocaleString()}
              </span>
              <span
                className={cn(
                  "flex items-center text-sm font-semibold",
                  isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {isPositive ? "+" : ""}
                {niftyChange.toFixed(2)} ({isPositive ? "+" : ""}
                {niftyChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* GIFT Nifty (After Hours) */}
          {!isOpen && giftNifty && (
            <div className="border-l pl-6">
              <p className="text-xs text-gray-500 mb-0.5">
                GIFT Nifty (After Hours)
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {giftNifty.value.toLocaleString()}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    giftNifty.change >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {giftNifty.change >= 0 ? "+" : ""}
                  {giftNifty.change.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const dummyMarketStatus: MarketStatusBannerProps = {
  isOpen: false,
  niftyValue: 25285.35,
  niftyChange: 103.55,
  niftyChangePercent: 0.41,
  timestamp: "10-Oct-2025 3:30 PM",
  giftNifty: {
    value: 25230,
    change: -55.35,
  },
};
