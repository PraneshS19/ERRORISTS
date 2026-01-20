import React from 'react';
import { Card, CardContent } from './ui/card';
import { TrendingUp } from 'lucide-react';
import { TrendData } from '../data/mockTrends';

interface TrendListProps {
  trends: TrendData[];
  selectedTrend: TrendData;
  onSelectTrend: (trend: TrendData) => void;
}

export const TrendList: React.FC<TrendListProps> = ({ trends, selectedTrend, onSelectTrend }) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
          <TrendingUp className="w-5 h-5" />
          Trending Now
        </h3>
        <div className="space-y-4">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md dark:hover:shadow-gray-900 ${
                selectedTrend.id === trend.id
                  ? 'border-primary bg-primary/10 dark:bg-primary/20 dark:border-primary'
                  : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600'
              }`}
              onClick={() => onSelectTrend(trend)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold dark:text-white">{trend.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{trend.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold dark:text-white">{trend.strengthScore}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {trend.patterns.slice(0, 2).map((pattern, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${pattern.color}15`,
                      color: pattern.color 
                    }}
                  >
                    {pattern.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};