import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TrendSource {
  name: string;
  contribution: number;
  color: string;
  icon: string; // Changed from React.ReactNode to string
}

interface SourceBadgesProps {
  sources: TrendSource[];
}

export const SourceBadges: React.FC<SourceBadgesProps> = ({ sources }) => {
  const chartData = sources.map(source => ({
    name: source.name,
    value: source.contribution,
    color: source.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Get the full payload object
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border dark:border-gray-700">
          <p className="font-medium dark:text-white">{data.name}</p>
          <p className="text-sm dark:text-gray-300">{data.value}% contribution</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Multi-Source Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value: string) => (
                    <span className="dark:text-gray-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium dark:text-white">Source Contribution</h4>
            <div className="space-y-2">
              {sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{source.icon}</span>
                    <span className="dark:text-gray-300">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${source.contribution}%`,
                          backgroundColor: source.color 
                        }}
                      />
                    </div>
                    <span className="font-medium dark:text-white">{source.contribution}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};