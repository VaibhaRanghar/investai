import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Search } from "lucide-react";
import { StockSearchInputProps } from "@/typesV2";


export const StockSearchInput: React.FC<StockSearchInputProps> = ({
  onSelect,
  placeholder = "Search stocks... (e.g., IRCTC, TCS)",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Dummy stock list - replace with real API call
  const dummyStocks = [
    "IRCTC",
    "RVNL",
    "RITES",
    "TCS",
    "INFY",
    "WIPRO",
    "RELIANCE",
    "HDFCBANK",
    "ICICIBANK",
    "SBIN",
    "TATAMOTORS",
  ];

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 0) {
      const filtered = dummyStocks.filter((stock) =>
        stock.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (symbol: string) => {
    setQuery(symbol);
    setShowSuggestions(false);
    onSelect(symbol);
  };

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        icon={<Search className="w-5 h-5" />}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((symbol, index) => (
            <button
              key={index}
              onClick={() => handleSelect(symbol)}
              className="w-full px-4 py-2 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <span className="font-semibold text-gray-900">{symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
