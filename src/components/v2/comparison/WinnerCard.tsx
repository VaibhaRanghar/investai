import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Trophy, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface WinnerCardProps {
  winnerSymbol: string;
  winnerName: string;
  score: number;
  reasoning: string[];
  recommendation: string;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({
  winnerSymbol,
  winnerName,
  score,
  reasoning,
  recommendation
}) => {
  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
      <CardContent className="py-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{winnerSymbol}</h3>
              <Badge variant="warning" size="lg">
                Winner
              </Badge>
              <Badge variant="info">{score}% Score</Badge>
            </div>
            <p className="text-gray-700 font-medium mb-4">{winnerName}</p>
            
            <div className="space-y-2 mb-4">
              <p className="font-semibold text-gray-900">Why {winnerSymbol} wins:</p>
              <ul className="space-y-1">
                {reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-300">
              <p className="text-sm font-semibold text-gray-900 mb-1">AI Recommendation</p>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyWinnerData: WinnerCardProps = {
  winnerSymbol: 'IRCTC',
  winnerName: 'Indian Railway Catering And Tourism Corporation Limited',
  score: 72,
  reasoning: [
    'Better valuation with P/E of 42.8 vs 55.3 (lower is better)',
    'Superior profit margin at 27% vs 15%',
    'Higher dividend yield of 1.12% for income investors',
    'Larger market cap indicates more stability',
    'Consistent profitability and lower financial risk'
  ],
  recommendation: 'IRCTC is the better choice for long-term value investors seeking stable returns. While RVNL shows stronger momentum (+45% in 52W), IRCTC offers superior fundamentals with lower valuation risk and consistent dividend income.'
};
