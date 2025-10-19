import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Metric, MetricsGridProps } from '@/typesV2';

export const MetricsGrid: React.FC<MetricsGridProps> = ({ 
  metrics,
  columns = 3 
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{metric.label}</p>
                {metric.badge && (
                  <Badge variant={metric.variant || 'neutral'} size="sm">
                    {metric.badge}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              {metric.subValue && (
                <p className="text-sm text-gray-600">{metric.subValue}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyMetricsData: Metric[] = [
  {
    label: 'P/E Ratio',
    value: '42.8',
    subValue: 'Sector: 43.78',
    variant: 'success',
    badge: 'Fair Value'
  },
  {
    label: 'Market Cap',
    value: '₹57,200 Cr',
    subValue: 'Mid Cap',
  },
  {
    label: 'EPS',
    value: '₹16.70',
    subValue: 'TTM',
  },
  {
    label: 'Book Value',
    value: '₹45.30',
    subValue: 'Per Share',
  },
  {
    label: 'Dividend Yield',
    value: '1.12%',
    subValue: '₹8/share annually',
    variant: 'success',
  },
  {
    label: 'Profit Margin',
    value: '27.07%',
    subValue: 'Last Quarter',
    variant: 'success',
  },
];
