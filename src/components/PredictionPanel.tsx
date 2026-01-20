import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Calendar, TrendingDown, AlertCircle } from 'lucide-react';

interface PredictionPanelProps {
  growthProbability: number;
  peakWindow: string;
  declineProbability: number;
  confidence: 'low' | 'medium' | 'high';
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  growthProbability,
  peakWindow,
  declineProbability,
  confidence
}) => {
  const confidenceColor = {
    low: { text: 'text-red-500', bg: 'bg-red-500' },
    medium: { text: 'text-yellow-500', bg: 'bg-yellow-500' },
    high: { text: 'text-green-500', bg: 'bg-green-500' }
  };

  const color = confidenceColor[confidence];

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <TrendingUp className="w-5 h-5" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium dark:text-gray-300">Growth Probability</span>
              </div>
              <div className="text-3xl font-bold text-green-500">{growthProbability}%</div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${growthProbability}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="font-medium dark:text-gray-300">Decline Probability</span>
              </div>
              <div className="text-3xl font-bold text-red-500">{declineProbability}%</div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${declineProbability}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 dark:text-gray-300" />
            <span className="font-medium dark:text-gray-300">Expected Peak Window</span>
          </div>
          <div className="p-3 bg-muted dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-medium dark:text-white">{peakWindow}</div>
            <div className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              Based on historical patterns and current growth trajectory
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium dark:text-gray-300">Prediction Confidence</span>
            <span className={`font-bold ${color.text}`}>
              {confidence.toUpperCase()}
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${color.bg}`}
              style={{ 
                width: confidence === 'high' ? '90%' : 
                       confidence === 'medium' ? '70%' : '50%' 
              }}
            />
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-yellow-800 dark:text-yellow-300">Disclaimer</div>
              <div className="text-yellow-700 dark:text-yellow-400 mt-1">
                Predictions are probabilistic and based on historical data patterns. 
                Actual outcomes may vary due to external factors and market conditions.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};