import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { cn } from "@/app/lib/utils";
import { TechnicalIndicatorsProps } from "@/typesV2";

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  indicators,
  overallSignal,
  buySignals,
  sellSignals,
  neutralSignals,
}) => {
  const getSignalBadge = (signal: string) => {
    if (signal === "BUY") return <Badge variant="success">BUY</Badge>;
    if (signal === "SELL") return <Badge variant="danger">SELL</Badge>;
    return <Badge variant="neutral">NEUTRAL</Badge>;
  };

  const getOverallColor = () => {
    if (overallSignal === "BUY") return "from-green-500 to-emerald-600";
    if (overallSignal === "SELL") return "from-red-500 to-rose-600";
    return "from-gray-500 to-gray-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Signal */}
        <div
          className={cn(
            "p-6 rounded-lg bg-gradient-to-r text-white",
            getOverallColor()
          )}
        >
          <p className="text-sm opacity-90 mb-1">Overall Signal</p>
          <p className="text-3xl font-bold mb-3">{overallSignal}</p>
          <div className="flex items-center space-x-4 text-sm">
            <span>Buy: {buySignals}</span>
            <span>•</span>
            <span>Sell: {sellSignals}</span>
            <span>•</span>
            <span>Neutral: {neutralSignals}</span>
          </div>
        </div>

        {/* Indicators List */}
        <div className="space-y-3">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {indicator.name}
                  </p>
                  {getSignalBadge(indicator.signal)}
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {indicator.description}
                </p>
                <p className="text-sm font-mono text-gray-700">
                  {indicator.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyTechnicalIndicatorsData: TechnicalIndicatorsProps = {
  overallSignal: "BUY",
  buySignals: 8,
  sellSignals: 2,
  neutralSignals: 3,
  indicators: [
    {
      name: "RSI (14)",
      value: "58.3",
      signal: "NEUTRAL",
      description: "Neither overbought nor oversold",
    },
    {
      name: "MACD",
      value: "Bullish Crossover",
      signal: "BUY",
      description: "Signal line crossed above MACD",
    },
    {
      name: "Moving Avg (5)",
      value: "Above",
      signal: "BUY",
      description: "Price trading above 5-day MA",
    },
    {
      name: "Moving Avg (20)",
      value: "Above",
      signal: "BUY",
      description: "Price trading above 20-day MA",
    },
    {
      name: "Moving Avg (50)",
      value: "Above",
      signal: "BUY",
      description: "Price trading above 50-day MA",
    },
    {
      name: "Bollinger Bands",
      value: "Middle Band",
      signal: "NEUTRAL",
      description: "Price near middle band",
    },
    {
      name: "ADX",
      value: "32.5 (Strong)",
      signal: "BUY",
      description: "Strong trend detected",
    },
    {
      name: "Stochastic",
      value: "65.2",
      signal: "NEUTRAL",
      description: "Moderate momentum",
    },
  ],
};
