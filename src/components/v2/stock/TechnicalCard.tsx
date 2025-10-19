import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { TechnicalCardProps } from "@/typesV2";


export const TechnicalCard: React.FC<TechnicalCardProps> = ({
  trend,
  ma5,
  ma10,
  ma20,
  rsi,
  macd,
  levels,
}) => {
  const trendColors: {
    bullish: "success";
    bearish: "danger";
    neutral: "warning";
  } = {
    bullish: "success",
    bearish: "danger",
    neutral: "warning",
  };

  const getRSIStatus = (value: number) => {
    if (value > 70) return { text: "Overbought", variant: "danger" as const };
    if (value < 30) return { text: "Oversold", variant: "success" as const };
    return { text: "Neutral", variant: "neutral" as const };
  };

  const rsiStatus = getRSIStatus(rsi);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Technical Analysis</CardTitle>
          <Badge variant={trendColors[trend]}>
            {trend === "bullish" && <TrendingUp className="w-4 h-4 mr-1" />}
            {trend === "bearish" && <TrendingDown className="w-4 h-4 mr-1" />}
            {trend.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Moving Averages */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Moving Averages
          </h4>
          <div className="space-y-2">
            <MAItem label="5-Day MA" value={ma5} />
            <MAItem label="10-Day MA" value={ma10} />
            <MAItem label="20-Day MA" value={ma20} />
          </div>
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500 mb-1">RSI (14)</p>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {rsi.toFixed(1)}
              </span>
              <Badge variant={rsiStatus.variant} size="sm">
                {rsiStatus.text}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">MACD</p>
            <Badge variant={macd === "bullish" ? "success" : "danger"}>
              {macd === "bullish" ? "Bullish Crossover" : "Bearish Crossover"}
            </Badge>
          </div>
        </div>

        {/* Support & Resistance */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Key Levels
          </h4>
          <div className="space-y-2">
            {levels.map((level, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded",
                      level.type === "resistance"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    )}
                  >
                    {level.type.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600 capitalize">
                    {level.strength}
                  </span>
                </div>
                <span className="text-base font-semibold text-gray-900">
                  ₹{level.level.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MAItem: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">
        ₹{value.toFixed(2)}
      </span>
    </div>
  );
};

export const dummyTechnicalData: TechnicalCardProps = {
  trend: "bullish",
  ma5: 712.5,
  ma10: 708.3,
  ma20: 695.8,
  rsi: 58.3,
  macd: "bullish",
  levels: [
    { type: "resistance", level: 750, strength: "strong" },
    { type: "resistance", level: 730, strength: "moderate" },
    { type: "support", level: 700, strength: "strong" },
    { type: "support", level: 680, strength: "moderate" },
  ],
};
