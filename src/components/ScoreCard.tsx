// components/ScoreCard.tsx
import { ComparisonResponse } from "@/types";

interface ScoreCardProps {
  data: ComparisonResponse;
}

export default function ScoreCard({ data }: ScoreCardProps) {
  const calculateScore = () => {
    const winners = data.winnerByMetric;
    let scoreA = 0;
    let scoreB = 0;
    let ties = 0;

    Object.values(winners).forEach((winner) => {
      if (winner === "A") scoreA++;
      else if (winner === "B") scoreB++;
      else ties++;
    });

    return { scoreA, scoreB, ties, total: Object.keys(winners).length };
  };

  const { scoreA, scoreB, ties, total } = calculateScore();
  const overallWinner = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "Tie";

  const getWinnerGradient = () => {
    if (overallWinner === "A") return "from-purple-500 to-purple-700";
    if (overallWinner === "B") return "from-indigo-500 to-indigo-700";
    return "from-gray-500 to-gray-700";
  };

  const getWinnerStock = () => {
    if (overallWinner === "A") return data.stockA;
    if (overallWinner === "B") return data.stockB;
    return null;
  };

  const winnerStock = getWinnerStock();

  return (
    <div
      className={`bg-gradient-to-br ${getWinnerGradient()} rounded-xl p-8 shadow-lg text-black`}
    >
      <div className="flex items-center justify-between mb-6 text-white">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">Overall Winner</p>
          <h2 className="text-4xl font-bold">
            {overallWinner === "Tie"
              ? "It's a Tie!"
              : winnerStock?.name || "Winner"}
          </h2>
          {winnerStock && (
            <p className="text-lg opacity-90 mt-1">{winnerStock.symbol}</p>
          )}
        </div>

        <div className="text-right">
          <div className="text-6xl font-bold">
            {overallWinner === "A"
              ? scoreA
              : overallWinner === "B"
              ? scoreB
              : "-"}
          </div>
          <p className="text-sm opacity-90">out of {total} metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-2xl font-bold">{scoreA}</p>
          <p className="text-xs opacity-90">{data.stockA.symbol} Wins</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-2xl font-bold">{ties}</p>
          <p className="text-xs opacity-90">Ties</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-2xl font-bold">{scoreB}</p>
          <p className="text-xs opacity-90">{data.stockB.symbol} Wins</p>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold mb-1">AI Insight</p>
            <p className="text-sm opacity-90">
              {data.insight !== "Unable to generate auto-insight at the moment."
                ? data.insight
                : `Based on ${total} key metrics, ${
                    overallWinner === "Tie"
                      ? "both stocks show comparable performance"
                      : `${winnerStock?.symbol} demonstrates stronger overall fundamentals`
                  }.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
