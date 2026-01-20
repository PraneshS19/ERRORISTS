import React from 'react';
import { Badge } from './ui/badge';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: 'low' | 'medium' | 'high';
  type?: 'prediction' | 'data' | 'analysis';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ 
  confidence, 
  type = 'prediction' 
}) => {
  const config = {
    low: {
      label: 'Low Confidence',
      color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
      icon: AlertCircle,
      description: 'Limited data or high volatility'
    },
    medium: {
      label: 'Medium Confidence',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
      icon: Shield,
      description: 'Moderate data quality with some uncertainty'
    },
    high: {
      label: 'High Confidence',
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      icon: CheckCircle,
      description: 'Strong data support with consistent patterns'
    }
  };

  const { label, color, icon: Icon, description } = config[confidence];
  
  const typeLabels = {
    prediction: 'Prediction confidence',
    data: 'Data quality',
    analysis: 'Analysis reliability'
  };

  return (
    <div className="flex items-start gap-2">
      <Badge variant="outline" className={`gap-1 ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        <div className="font-medium">{typeLabels[type]}</div>
        <div>{description}</div>
      </div>
    </div>
  );
};