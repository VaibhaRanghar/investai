import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { ComparisonChartProps } from "@/typesV2";



export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  stock1Symbol,
  stock2Symbol,
  data,
}) => {
  const maxValue = Math.max(...data.flatMap((d) => [d.stock1, d.stock2]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visual Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index}>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {item.label}
              </p>
              <div className="space-y-2">
                {/* Stock 1 Bar */}
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-indigo-600 w-16">
                    {stock1Symbol}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.stock1 / maxValue) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {item.stock1.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Stock 2 Bar */}
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-purple-600 w-16">
                    {stock2Symbol}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.stock2 / maxValue) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {item.stock2.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyChartData: ComparisonChartProps = {
  stock1Symbol: "IRCTC",
  stock2Symbol: "RVNL",
  data: [
    { label: "P/E Ratio", stock1: 42.8, stock2: 55.3 },
    { label: "Profit Margin (%)", stock1: 27.1, stock2: 15.3 },
    { label: "Dividend Yield (%)", stock1: 1.12, stock2: 0.87 },
    { label: "EPS (₹)", stock1: 16.7, stock2: 6.24 },
  ],
};
