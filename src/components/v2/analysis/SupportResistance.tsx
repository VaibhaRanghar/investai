import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "../ui/Badge";
import { SupportResistanceProps } from "@/typesV2";



export const SupportResistance: React.FC<SupportResistanceProps> = ({
  currentPrice,
  supports,
  resistances,
}) => {
  const getStrengthColor = (strength: string) => {
    if (strength === "Strong") return "bg-green-600";
    if (strength === "Moderate") return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support & Resistance Levels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Price */}
        <div className="flex items-center justify-center py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-300">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Current Price</p>
            <p className="text-3xl font-bold text-indigo-600">
              ₹{currentPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Resistances */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowUp className="w-5 h-5 text-red-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Resistance Levels
            </h4>
          </div>
          <div className="space-y-2">
            {resistances
              .sort((a, b) => a.price - b.price)
              .map((level, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${getStrengthColor(
                        level.strength
                      )}`}
                    />
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        ₹{level.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {level.touchCount} touches
                      </p>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {level.strength}
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        {/* Supports */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowDown className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Support Levels
            </h4>
          </div>
          <div className="space-y-2">
            {supports
              .sort((a, b) => b.price - a.price)
              .map((level, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${getStrengthColor(
                        level.strength
                      )}`}
                    />
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        ₹{level.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {level.touchCount} touches
                      </p>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {level.strength}
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummySupportResistanceData: SupportResistanceProps = {
  currentPrice: 715,
  resistances: [
    { price: 750, strength: "Strong", touchCount: 5 },
    { price: 730, strength: "Moderate", touchCount: 3 },
    { price: 720, strength: "Weak", touchCount: 2 },
  ],
  supports: [
    { price: 700, strength: "Strong", touchCount: 6 },
    { price: 680, strength: "Moderate", touchCount: 4 },
    { price: 660, strength: "Strong", touchCount: 5 },
  ],
};
