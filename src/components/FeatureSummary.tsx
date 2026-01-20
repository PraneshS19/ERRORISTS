import React from 'react';
import { Card, CardContent } from './ui/card';

export const FeatureSummary: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-center dark:text-white">Implemented Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-green-500 font-bold text-sm mb-2">✓ IMPLEMENTED</div>
            <ul className="space-y-2 text-sm dark:text-gray-300">
              <li>• Multi-source trend ingestion</li>
              <li>• Trend strength scoring</li>
              <li>• Pattern detection</li>
              <li>• Explainable trend insights</li>
              <li>• Risk analysis</li>
              <li>• Personalized views</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-yellow-500 font-bold text-sm mb-2">🟡 PARTIAL</div>
            <ul className="space-y-2 text-sm dark:text-gray-300">
              <li>• Forecasting & predictions</li>
              <li>• Geo-intelligent trends</li>
              <li>• Smart alerts</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-purple-500 font-bold text-sm mb-2">🔮 FUTURE SCOPE</div>
            <ul className="space-y-2 text-sm dark:text-gray-300">
              <li>• Graph-based trend relationships</li>
              <li>• Advanced noise filtering</li>
              <li>• Deep ML forecasting</li>
              <li>• Real-time streaming</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};