export interface TrendPattern {
  type: 'seasonal' | 'flash' | 'sustained' | 're-emerging';
  label: string;
  color: string;
  description: string;
}

export interface TrendSource {
  name: string;
  contribution: number;
  color: string;
  icon: string;
}

export interface TrendSentiment {
  positive: number;
  negative: number;
  neutral: number;
}

export interface TrendPrediction {
  growthProbability: number;
  peakWindow: string;
  declineProbability: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface Alert {
  type: 'spike' | 'decline' | 'threshold';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export interface TrendData {
  id: string;
  name: string;
  category: string;
  description: string;
  strengthScore: number;
  growthRate: number;
  mentionVelocity: number;
  timeConsistency: number;
  sentiment: TrendSentiment;
  patterns: TrendPattern[];
  sources: TrendSource[];
  riskLevel: 'low' | 'medium' | 'high';
  riskReasons: string[];
  predictions: TrendPrediction;
  topKeywords: string[];
  triggeringEvents: string[];
  sourceDominance: string;
  geoDistribution: Array<{region: string; intensity: number}>;
  actionInsights: {
    contentIdeas: string[];
    startupIdeas: string[];
    researchOpportunities: string[];
  };
  alerts: Alert[];
  mentionsTimeline: Array<{date: string; count: number}>;
}