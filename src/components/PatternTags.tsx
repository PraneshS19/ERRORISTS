import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tag, TrendingUp, Zap, Calendar, RefreshCw } from 'lucide-react';
import { TrendPattern } from '../types';

interface PatternTagsProps {
  patterns: TrendPattern[];
}

export const PatternTags: React.FC<PatternTagsProps> = ({ patterns }) => {
  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'seasonal': return <Calendar className="w-4 h-4" />;
      case 'flash': return <Zap className="w-4 h-4" />;
      case 'sustained': return <TrendingUp className="w-4 h-4" />;
      case 're-emerging': return <RefreshCw className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Tag className="w-5 h-5" />
          Pattern Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full border dark:border-opacity-50"
                style={{ 
                  backgroundColor: `${pattern.color}15`,
                  borderColor: pattern.color 
                }}
              >
                {getPatternIcon(pattern.type)}
                <span className="font-medium" style={{ color: pattern.color }}>
                  {pattern.label}
                </span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium dark:text-white">Pattern Analysis</h4>
            {patterns.map((pattern, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="font-medium" style={{ color: pattern.color }}>
                  {pattern.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {pattern.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};