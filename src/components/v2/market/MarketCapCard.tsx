import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Building2, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { MarketCapCardProps } from "@/typesV2";


export const MarketCapCard: React.FC<MarketCapCardProps> = ({
  totalMarketCap,
  totalMarketCapUSD,
  change,
  changePercent,
}) => {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Total Market Cap
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(totalMarketCap / 100000).toFixed(2)}L Cr
            </p>
            <p className="text-sm text-gray-500">
              ${totalMarketCapUSD.toFixed(2)} Trillion USD
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
              {isPositive ? "+" : ""}₹{(change / 1000).toFixed(2)}K Cr (
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyMarketCapData: MarketCapCardProps = {
  totalMarketCap: 45961925.4,
  totalMarketCapUSD: 5.18,
  change: 185000,
  changePercent: 0.4,
};
