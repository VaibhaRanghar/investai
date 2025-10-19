import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { OptionsChainCardProps } from "@/typesV2";


export const OptionsChainCard: React.FC<OptionsChainCardProps> = ({
  currentPrice,
  data,
}) => {
  const getPCRSentiment = (pcr: number) => {
    if (pcr > 1.2) return { text: "Bullish", variant: "success" as const };
    if (pcr < 0.8) return { text: "Bearish", variant: "danger" as const };
    return { text: "Neutral", variant: "warning" as const };
  };

  const sentiment = getPCRSentiment(data.putCallRatio);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Options Analysis</CardTitle>
          <Badge variant={sentiment.variant}>{sentiment.text} Signal</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PCR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-gray-600 mb-1">Put-Call Ratio</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.putCallRatio.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.putCallRatio > 1
                ? "More Puts (Bullish)"
                : "More Calls (Bearish)"}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600 mb-1">Max Pain Level</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-gray-900">
                ₹{data.maxPain}
              </p>
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentPrice > data.maxPain ? "Above" : "Below"} current price
            </p>
          </div>
        </div>

        {/* OI Analysis */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Open Interest Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Highest Put OI</p>
                  <p className="text-sm font-semibold text-gray-900">
                    Strike: ₹{data.highestPutOI.strike}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {(data.highestPutOI.oi / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-gray-500">Strong Support</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Highest Call OI</p>
                  <p className="text-sm font-semibold text-gray-900">
                    Strike: ₹{data.highestCallOI.strike}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600">
                  {(data.highestCallOI.oi / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-gray-500">Strong Resistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* IV */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Implied Volatility</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Market expectation of future volatility
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {data.impliedVolatility.toFixed(1)}%
              </p>
              <Badge
                variant={data.impliedVolatility > 30 ? "warning" : "neutral"}
                size="sm"
              >
                {data.impliedVolatility > 30 ? "High" : "Normal"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyOptionsData: OptionsChainCardProps = {
  currentPrice: 715,
  data: {
    putCallRatio: 0.85,
    maxPain: 725,
    highestCallOI: { strike: 750, oi: 2500000 },
    highestPutOI: { strike: 700, oi: 3200000 },
    impliedVolatility: 28.5,
  },
};
