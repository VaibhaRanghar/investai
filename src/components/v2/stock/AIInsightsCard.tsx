/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIInsightsCardProps } from "@/typesV2";

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  analysis,
  recommendation,
  confidence,
  insights,
  targets,
  loading = false,
}) => {
  const recommendationColors = {
    BUY: "success",
    HOLD: "warning",
    SELL: "danger",
    AVOID: "danger",
  };

  const recommendationIcons = {
    BUY: <TrendingUp className="w-5 h-5" />,
    HOLD: <Target className="w-5 h-5" />,
    SELL: <AlertTriangle className="w-5 h-5" />,
    AVOID: <AlertTriangle className="w-5 h-5" />,
  };

  if (loading) {
    return (
      <Card variant="gradient">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
            <p className="text-gray-600 font-medium">
              AI is analyzing the stock...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <CardTitle>AI Analysis</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={recommendationColors[recommendation] as any}>
              <span className="flex items-center space-x-1">
                {recommendationIcons[recommendation]}
                <span>{recommendation}</span>
              </span>
            </Badge>
            <Badge variant="info">{confidence}% Confidence</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Text */}
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {analysis}
          </p>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Key Insights</h4>
          {insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg border",
                insight.type === "positive" && "bg-green-50 border-green-200",
                insight.type === "negative" && "bg-red-50 border-red-200",
                insight.type === "neutral" && "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex-shrink-0">
                {insight.type === "positive" && "✅"}
                {insight.type === "negative" && "⚠️"}
                {insight.type === "neutral" && "ℹ️"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {insight.category}
                </p>
                <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Targets */}
        {targets && (
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Suggested Levels
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Entry</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{targets.entry}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
                <p className="text-lg font-bold text-red-600">
                  ₹{targets.stopLoss}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Target</p>
                <p className="text-lg font-bold text-indigo-600">
                  ₹{targets.target}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
