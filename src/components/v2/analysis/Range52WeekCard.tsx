import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { cn } from "@/lib/utils";
import { Range52WeekCardProps } from "@/typesV2";

export const Range52WeekCard: React.FC<Range52WeekCardProps> = ({
  current,
  low,
  high,
  lowDate,
  highDate,
}) => {
  const position = ((current - low) / (high - low)) * 100;
  const fromLow = ((current - low) / low) * 100;
  const fromHigh = ((high - current) / high) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>52-Week Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Range Bar */}
        <div className="relative pt-6">
          <div className="h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full">
            <div
              className="absolute top-0 transform -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-lg" />
                <div className="mt-2 px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded whitespace-nowrap">
                  ₹{current.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <div className="text-left">
              <p className="font-semibold text-red-600">₹{low.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{lowDate}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">₹{high.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{highDate}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Position</p>
            <p className="text-xl font-bold text-gray-900">
              {position.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">From Low</p>
            <p className="text-xl font-bold text-green-600">
              +{fromLow.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">From High</p>
            <p className="text-xl font-bold text-red-600">
              -{fromHigh.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Assessment */}
        <div
          className={cn(
            "p-3 rounded-lg text-sm",
            position < 30 &&
              "bg-green-50 text-green-800 border border-green-200",
            position >= 30 &&
              position < 70 &&
              "bg-yellow-50 text-yellow-800 border border-yellow-200",
            position >= 70 && "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          <p className="font-medium">
            {position < 30 &&
              "📊 Near 52-week low - Potential value opportunity"}
            {position >= 30 &&
              position < 70 &&
              "📈 Mid-range - Monitor for breakout or breakdown"}
            {position >= 70 &&
              "⚠️ Near 52-week high - Limited upside, watch for reversal"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyRange52Data: Range52WeekCardProps = {
  current: 715,
  low: 656,
  high: 900.4,
  lowDate: "07-Apr-2025",
  highDate: "16-Oct-2024",
};
