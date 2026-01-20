import React from 'react';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TrendStrengthMeterProps {
  score: number;
  growthRate: number;
  mentionVelocity: number;
  timeConsistency: number;
}

export const TrendStrengthMeter: React.FC<TrendStrengthMeterProps> = ({
  score,
  growthRate,
  mentionVelocity,
  timeConsistency
}) => {
  const getStrengthLabel = (score: number) => {
    if (score < 30) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500', darkBg: 'dark:bg-red-600' };
    if (score < 60) return { label: 'Emerging', color: 'text-yellow-500', bg: 'bg-yellow-500', darkBg: 'dark:bg-yellow-600' };
    if (score < 85) return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500', darkBg: 'dark:bg-green-600' };
    return { label: 'Saturated', color: 'text-blue-500', bg: 'bg-blue-500', darkBg: 'dark:bg-blue-600' };
  };

  const strength = getStrengthLabel(score);

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Activity className="w-5 h-5" />
          Trend Strength Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold dark:text-white">{score}/100</span>
            <span className={`px-3 py-1 rounded-full ${strength.bg} ${strength.darkBg} text-white text-sm font-medium`}>
              {strength.label}
            </span>
          </div>
          <Progress value={score} className="h-3 dark:bg-gray-700" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium dark:text-gray-300">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold dark:text-white">{growthRate}%</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium dark:text-gray-300">Mentions</span>
            </div>
            <div className="text-2xl font-bold dark:text-white">{mentionVelocity.toLocaleString()}/day</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium dark:text-gray-300">Consistency</span>
            </div>
            <div className="text-2xl font-bold dark:text-white">{timeConsistency}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};