import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Check } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ComparisonMetric {
  metric: string;
  stock1Value: string | number;
  stock2Value: string | number;
  winner: 1 | 2 | null;
  higherIsBetter: boolean;
}

interface ComparisonTableProps {
  stock1Symbol: string;
  stock2Symbol: string;
  metrics: ComparisonMetric[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  stock1Symbol,
  stock2Symbol,
  metrics
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Side-by-Side Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                <th className="text-center py-3 px-4 font-semibold text-indigo-600">{stock1Symbol}</th>
                <th className="text-center py-3 px-4 font-semibold text-purple-600">{stock2Symbol}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{metric.metric}</td>
                  <td className={cn(
                    'py-3 px-4 text-center font-semibold relative',
                    metric.winner === 1 ? 'text-indigo-600' : 'text-gray-700'
                  )}>
                    <div className="flex items-center justify-center space-x-2">
                      <span>{metric.stock1Value}</span>
                      {metric.winner === 1 && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </td>
                  <td className={cn(
                    'py-3 px-4 text-center font-semibold relative',
                    metric.winner === 2 ? 'text-purple-600' : 'text-gray-700'
                  )}>
                    <div className="flex items-center justify-center space-x-2">
                      <span>{metric.stock2Value}</span>
                      {metric.winner === 2 && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyComparisonData: ComparisonTableProps = {
  stock1Symbol: 'IRCTC',
  stock2Symbol: 'RVNL',
  metrics: [
    { metric: 'Current Price', stock1Value: '₹715.00', stock2Value: '₹345.20', winner: null, higherIsBetter: false },
    { metric: 'P/E Ratio', stock1Value: '42.8', stock2Value: '55.3', winner: 1, higherIsBetter: false },
    { metric: 'Market Cap', stock1Value: '₹57,200 Cr', stock2Value: '₹23,450 Cr', winner: 1, higherIsBetter: true },
    { metric: 'EPS', stock1Value: '₹16.70', stock2Value: '₹6.24', winner: 1, higherIsBetter: true },
    { metric: 'Dividend Yield', stock1Value: '1.12%', stock2Value: '0.87%', winner: 1, higherIsBetter: true },
    { metric: 'Profit Margin', stock1Value: '27.07%', stock2Value: '15.32%', winner: 1, higherIsBetter: true },
    { metric: 'Day Change', stock1Value: '+0.73%', stock2Value: '+2.15%', winner: 2, higherIsBetter: true },
    { metric: '52W Return', stock1Value: '-15.2%', stock2Value: '+45.6%', winner: 2, higherIsBetter: true },
  ]
};
