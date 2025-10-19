import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import { DividendCardProps } from "@/typesV2";



export const DividendCard: React.FC<DividendCardProps> = ({
  dividends,
  totalAnnual,
  yield: dividendYield,
  payoutRatio,
  consistency,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividend History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Annual Dividend</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalAnnual}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Dividend Yield</p>
            <p className="text-2xl font-bold text-green-600">
              {dividendYield}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Payout Ratio</p>
            <p className="text-2xl font-bold text-gray-900">{payoutRatio}%</p>
          </div>
        </div>

        {/* Consistency Badge */}
        <div className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-800">
            {consistency} Years of Consistent Dividends
          </span>
        </div>

        {/* Dividend Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Recent Dividends
          </h4>
          <div className="space-y-3">
            {dividends.map((dividend, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{dividend.amount} per share
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{dividend.date}</p>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={dividend.type === "Final" ? "success" : "info"}
                  size="sm"
                >
                  {dividend.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyDividendData: DividendCardProps = {
  dividends: [
    { date: "22-Aug-2025", amount: 1.0, type: "Final" },
    { date: "20-Feb-2025", amount: 3.0, type: "Interim" },
    { date: "14-Nov-2024", amount: 4.0, type: "Interim" },
    { date: "23-Aug-2024", amount: 4.0, type: "Final" },
  ],
  totalAnnual: 8.0,
  yield: 1.12,
  payoutRatio: 48,
  consistency: 5,
};
