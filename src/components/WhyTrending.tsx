import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Zap, Target, BarChart } from 'lucide-react';

interface WhyTrendingProps {
  topKeywords: string[];
  triggeringEvents: string[];
  sourceDominance: string;
}

export const WhyTrending: React.FC<WhyTrendingProps> = ({
  topKeywords,
  triggeringEvents,
  sourceDominance
}) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Sparkles className="w-5 h-5" />
          Why This Is Trending
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 dark:text-gray-300" />
            <h4 className="font-medium dark:text-white">Top Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {topKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 dark:text-gray-300" />
            <h4 className="font-medium dark:text-white">Triggering Events</h4>
          </div>
          <div className="space-y-2">
            {triggeringEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted dark:bg-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <span className="text-sm dark:text-gray-300">{event}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 dark:text-gray-300" />
            <h4 className="font-medium dark:text-white">Source Dominance</h4>
          </div>
          <div className="p-4 bg-muted dark:bg-gray-700 rounded-lg">
            <div className="font-medium dark:text-white">{sourceDominance}</div>
            <div className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              Indicates which platform is driving the most conversation
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-sm">
            <div className="font-medium text-blue-800 dark:text-blue-300">Analysis Insight</div>
            <div className="text-blue-700 dark:text-blue-400 mt-1">
              This trend is primarily driven by {sourceDominance.split(' ')[0].toLowerCase()} discussions 
              around {topKeywords.slice(0, 2).join(' and ')}. 
              The recent triggering events have accelerated its growth trajectory.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};