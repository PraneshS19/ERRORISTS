import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bell, AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Badge } from './ui/badge';

interface Alert {
  type: 'spike' | 'decline' | 'threshold';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface AlertCenterProps {
  alerts: Alert[];
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'spike': return <TrendingUp className="w-4 h-4" />;
      case 'decline': return <TrendingDown className="w-4 h-4" />;
      case 'threshold': return <Activity className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Bell className="w-5 h-5" />
          Smart Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getPriorityColor(alert.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="space-y-1">
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm opacity-75">{alert.timestamp}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      alert.priority === 'high' ? 'bg-red-500 text-white' :
                      alert.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-blue-500 text-white'
                    }>
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <div className="text-gray-500 dark:text-gray-400">No active alerts</div>
              <div className="text-sm text-gray-400 mt-1">
                All trends are within normal parameters
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};