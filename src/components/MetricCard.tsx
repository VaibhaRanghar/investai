// components/MetricCard.tsx
import { MetricCardProps } from "@/types";

export default function MetricCard({
  label,
  valueA,
  valueB,
  symbolA,
  symbolB,
  winner,
  format = "number",
  inverse = false,
}: MetricCardProps) {
  const formatValue = (value: number | null): string => {
    if (value === null || value === undefined) return "N/A";

    switch (format) {
      case "percent":
        return `${(value / 100).toFixed(2)}%`;
      case "currency":
        return `₹${value.toFixed(2)}`;
      case "ratio":
        return value.toFixed(2);
      default:
        return value.toFixed(2);
    }
  };

  const getWinnerStyle = (position: "A" | "B") => {
    if (winner === "Tie") return "border-gray-300 bg-white";
    if (winner === position) {
      return position === "A"
        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
        : "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200";
    }
    return "border-gray-300 bg-gray-50";
  };

  const getValueColor = (position: "A" | "B", value: number | null) => {
    if (value === null || winner === "Tie") return "text-gray-900";
    if (winner === position) {
      return position === "A" ? "text-purple-700" : "text-indigo-700";
    }
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
        {label}
        {winner !== "Tie" && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              winner === "A"
                ? "bg-purple-100 text-purple-700"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {winner === "A" ? symbolA : symbolB} Wins
          </span>
        )}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3 rounded-lg border-2 transition-all ${getWinnerStyle(
            "A"
          )}`}
        >
          <p className="text-xs text-gray-600 mb-1">{symbolA}</p>
          <p className={`text-xl font-bold ${getValueColor("A", valueA)}`}>
            {formatValue(valueA)}
          </p>
          {winner === "A" && (
            <div className="mt-1 flex items-center gap-1">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <div
          className={`p-3 rounded-lg border-2 transition-all ${getWinnerStyle(
            "B"
          )}`}
        >
          <p className="text-xs text-gray-600 mb-1">{symbolB}</p>
          <p className={`text-xl font-bold ${getValueColor("B", valueB)}`}>
            {formatValue(valueB)}
          </p>
          {winner === "B" && (
            <div className="mt-1 flex items-center gap-1">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
