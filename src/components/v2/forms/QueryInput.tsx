import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Search, Sparkles } from "lucide-react";
import { QueryInputProps } from "@/typesV2";


export const QueryInput: React.FC<QueryInputProps> = ({
  onSubmit,
  loading = false,
  placeholder = 'Ask anything... e.g., "Analyze IRCTC" or "Compare IRCTC vs RVNL"',
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            icon={<Search className="w-5 h-5" />}
            disabled={loading}
            className="text-lg"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading || !query.trim()}
          loading={loading}
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Analyze
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <QuickAction onClick={() => setQuery("Analyze IRCTC")}>
          Analyze IRCTC
        </QuickAction>
        <QuickAction onClick={() => setQuery("Compare IRCTC vs RVNL")}>
          Compare IRCTC vs RVNL
        </QuickAction>
        <QuickAction onClick={() => setQuery("Top gainers today")}>
          Top gainers today
        </QuickAction>
        <QuickAction onClick={() => setQuery("Best dividend stocks")}>
          Best dividend stocks
        </QuickAction>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full border border-indigo-200 transition-colors"
    >
      {children}
    </button>
  );
};
