// components/StockHeader.tsx
import { StockHeaderProps } from "@/types";
import Image from "next/image";

export default function StockHeader({ stock, position }: StockHeaderProps) {
  const bgColor = position === "A" ? "bg-purple-50" : "bg-indigo-50";
  const borderColor =
    position === "A" ? "border-purple-200" : "border-indigo-200";
  const textColor = position === "A" ? "text-purple-700" : "text-indigo-700";
  const badgeColor = position === "A" ? "bg-purple-600" : "bg-indigo-600";

  const priceChange =
    stock.price !== 0 ? ((stock.price - stock.low52w) / stock.low52w) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <div
      className={`${bgColor} ${borderColor} border-2 rounded-xl p-6 shadow-sm`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {stock.logo ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm">
              <Image
                src={stock.logo}
                alt={stock.name}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          ) : (
            <div
              className={`w-16 h-16 rounded-xl ${badgeColor} flex items-center justify-center text-white text-2xl font-bold`}
            >
              {stock.symbol.substring(0, 2)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {stock.name || stock.symbol}
            </h2>
            <p className={`text-sm font-medium ${textColor}`}>{stock.symbol}</p>
            {stock.sector && (
              <p className="text-xs text-gray-500 mt-1">{stock.sector}</p>
            )}
          </div>
        </div>
        <span
          className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}
        >
          Stock {position}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Current Price</p>
          <p className="text-3xl font-bold text-gray-900">
            {stock.price > 0 ? `₹${stock.price.toFixed(2)}` : "N/A"}
          </p>
          {stock.price > 0 && (
            <p
              className={`text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}% from 52W Low
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">52W Range</p>
          <p className="text-sm text-gray-900 font-medium">
            ₹{stock.low52w.toFixed(2)} - ₹{stock.high52w.toFixed(2)}
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${badgeColor} h-2 rounded-full`}
              style={{
                width:
                  stock.high52w > 0
                    ? `${
                        ((stock.price - stock.low52w) /
                          (stock.high52w - stock.low52w)) *
                        100
                      }%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
