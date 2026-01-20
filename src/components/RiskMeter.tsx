import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react';

interface RiskMeterProps {
  riskLevel: 'low' | 'medium' | 'high';
  riskReasons: string[];
  saturationLevel: number;
  lifespan: 'short' | 'medium' | 'long';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  riskLevel,
  riskReasons,
  saturationLevel,
  lifespan
}) => {
  const riskConfig = {
    low: { 
      color: 'text-green-500', 
      bg: 'bg-green-500', 
      darkBg: 'dark:bg-green-600',
      lightBg: 'bg-green-100 dark:bg-green-900/30',
      icon: Shield 
    },
    medium: { 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-500', 
      darkBg: 'dark:bg-yellow-600',
      lightBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      icon: AlertTriangle 
    },
    high: { 
      color: 'text-red-500', 
      bg: 'bg-red-500', 
      darkBg: 'dark:bg-red-600',
      lightBg: 'bg-red-100 dark:bg-red-900/30',
      icon: TrendingDown 
    }
  };

  const RiskIcon = riskConfig[riskLevel].icon;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <RiskIcon className="w-5 h-5" />
          Trend Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium dark:text-white">Risk Level</div>
            <div className={`px-4 py-2 rounded-full ${riskConfig[riskLevel].bg} ${riskConfig[riskLevel].darkBg} text-white font-medium`}>
              {riskLevel.toUpperCase()}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm dark:text-gray-400">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${riskConfig[riskLevel].bg} ${riskConfig[riskLevel].darkBg}`}
                style={{ 
                  width: riskLevel === 'low' ? '33%' : riskLevel === 'medium' ? '66%' : '100%' 
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium dark:text-white">Risk Factors</h4>
          <div className="space-y-2">
            {riskReasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500" />
                <span className="text-sm dark:text-gray-300">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium dark:text-white">Saturation Level</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm dark:text-gray-400">
                <span>Low</span>
                <span>High</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    saturationLevel > 70 ? 'bg-red-500 dark:bg-red-600' : 
                    saturationLevel > 40 ? 'bg-yellow-500 dark:bg-yellow-600' : 
                    'bg-green-500 dark:bg-green-600'
                  }`}
                  style={{ width: `${saturationLevel}%` }}
                />
              </div>
              <div className="text-center text-sm font-medium dark:text-white">{saturationLevel}%</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium dark:text-white">Expected Lifespan</h4>
            <div className="text-center py-3">
              <div className={`text-2xl font-bold ${
                lifespan === 'long' ? 'text-green-500 dark:text-green-400' : 
                lifespan === 'medium' ? 'text-yellow-500 dark:text-yellow-400' : 
                'text-red-500 dark:text-red-400'
              }`}>
                {lifespan.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {lifespan === 'long' ? '6+ months' : 
                 lifespan === 'medium' ? '1-6 months' : '< 1 month'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};