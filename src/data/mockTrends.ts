export interface TrendSource {
  name: string;
  contribution: number;
  icon: string;
  color: string;
}

export interface TrendPattern {
  type: 'seasonal' | 'flash' | 'sustained' | 're-emerging';
  label: string;
  description: string;
  color: string;
}

export interface TrendPrediction {
  growthProbability: number;
  peakWindow: string;
  declineProbability: number;
  confidence: 'low' | 'medium' | 'high';
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
  sources: TrendSource[];
  patterns: TrendPattern[];
  riskLevel: 'low' | 'medium' | 'high';
  riskReasons: string[];
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  predictions: TrendPrediction;
  topKeywords: string[];
  triggeringEvents: string[];
  sourceDominance: string;
  geoDistribution: Array<{
    region: string;
    intensity: number;
  }>;
  actionInsights: {
    contentIdeas: string[];
    startupIdeas: string[];
    researchOpportunities: string[];
  };
  alerts: Array<{
    type: 'spike' | 'decline' | 'threshold';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  mentionsTimeline: Array<{
    date: string;
    count: number;
  }>;
  sentimentTimeline: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

export const mockTrends: TrendData[] = [
  {
    id: '1',
    name: 'AI in Education',
    category: 'Technology',
    description: 'Integration of artificial intelligence in educational tools and platforms',
    strengthScore: 78,
    growthRate: 18,
    mentionVelocity: 1450,
    timeConsistency: 85,
    sources: [
      { name: 'Reddit', contribution: 64, icon: '📱', color: '#FF6B6B' },
      { name: 'Google Trends', contribution: 22, icon: '🔍', color: '#4ECDC4' },
      { name: 'News', contribution: 14, icon: '📰', color: '#45B7D1' }
    ],
    patterns: [
      { type: 'sustained', label: 'Sustained Growth', description: 'Consistent growth over 4+ weeks', color: '#10B981' },
      { type: 'seasonal', label: 'Back-to-School', description: 'Peaks during academic seasons', color: '#3B82F6' }
    ],
    riskLevel: 'medium',
    riskReasons: ['Market overcrowding', 'High expectations', 'Regulatory uncertainty'],
    sentiment: { positive: 62, negative: 21, neutral: 17 },
    predictions: {
      growthProbability: 85,
      peakWindow: 'Mar 15 - Apr 10, 2025',
      declineProbability: 35,
      confidence: 'high'
    },
    topKeywords: ['EdTech', 'Personalized Learning', 'ChatGPT', 'Adaptive Learning', 'AI Tutors'],
    triggeringEvents: ['New AI education policies', 'Tech company investments', 'Academic research breakthroughs'],
    sourceDominance: 'Reddit (64% contribution)',
    geoDistribution: [
      { region: 'North America', intensity: 85 },
      { region: 'Europe', intensity: 72 },
      { region: 'Asia', intensity: 68 },
      { region: 'Oceania', intensity: 45 }
    ],
    actionInsights: {
      contentIdeas: [
        'AI tools for teachers',
        'Personalized learning paths',
        'Gamified education apps'
      ],
      startupIdeas: [
        'AI-powered homework helper',
        'Virtual classroom assistant',
        'Adaptive testing platform'
      ],
      researchOpportunities: [
        'AI bias in education',
        'Long-term impact studies',
        'Accessibility improvements'
      ]
    },
    alerts: [
      { type: 'spike', message: 'Sudden 250% increase in mentions', timestamp: '2 hours ago', priority: 'high' },
      { type: 'threshold', message: 'Strength score crossed 75', timestamp: '1 day ago', priority: 'medium' }
    ],
    mentionsTimeline: Array.from({ length: 7 }, (_, i) => ({
      date: `Feb ${10 + i}`,
      count: Math.floor(Math.random() * 5000) + 2000
    })),
    sentimentTimeline: Array.from({ length: 7 }, (_, i) => ({
      date: `Feb ${10 + i}`,
      positive: Math.floor(Math.random() * 2000) + 1000,
      negative: Math.floor(Math.random() * 500) + 200,
      neutral: Math.floor(Math.random() * 800) + 400
    }))
  },
  {
    id: '2',
    name: 'Sustainable Fashion',
    category: 'Lifestyle',
    description: 'Eco-friendly clothing and ethical manufacturing practices',
    strengthScore: 65,
    growthRate: 12,
    mentionVelocity: 890,
    timeConsistency: 72,
    sources: [
      { name: 'Instagram', contribution: 58, icon: '📸', color: '#E1306C' },
      { name: 'TikTok', contribution: 32, icon: '🎵', color: '#000000' },
      { name: 'News', contribution: 10, icon: '📰', color: '#45B7D1' }
    ],
    patterns: [
      { type: 'seasonal', label: 'Seasonal', description: 'Peaks during fashion weeks', color: '#3B82F6' },
      { type: 're-emerging', label: 'Re-emerging', description: 'Previously trended in 2023', color: '#8B5CF6' }
    ],
    riskLevel: 'low',
    riskReasons: ['Growing consumer awareness', 'Regulatory support'],
    sentiment: { positive: 78, negative: 8, neutral: 14 },
    predictions: {
      growthProbability: 72,
      peakWindow: 'Apr 5 - May 15, 2025',
      declineProbability: 25,
      confidence: 'medium'
    },
    topKeywords: ['Circular Economy', 'Upcycling', 'Ethical Production', 'Organic Materials'],
    triggeringEvents: ['Fashion week showcases', 'Celebrity endorsements', 'Documentary releases'],
    sourceDominance: 'Instagram (58% contribution)',
    geoDistribution: [
      { region: 'Europe', intensity: 92 },
      { region: 'North America', intensity: 78 },
      { region: 'Asia', intensity: 65 }
    ],
    actionInsights: {
      contentIdeas: [
        'Sustainable brand reviews',
        'DIY upcycling tutorials',
        'Ethical fashion guides'
      ],
      startupIdeas: [
        'Clothing rental platform',
        'Sustainable fabric marketplace',
        'Carbon footprint tracker'
      ],
      researchOpportunities: [
        'Impact measurement',
        'Consumer behavior studies',
        'Supply chain transparency'
      ]
    },
    alerts: [],
    mentionsTimeline: Array.from({ length: 7 }, (_, i) => ({
      date: `Feb ${10 + i}`,
      count: Math.floor(Math.random() * 4000) + 1500
    })),
    sentimentTimeline: Array.from({ length: 7 }, (_, i) => ({
      date: `Feb ${10 + i}`,
      positive: Math.floor(Math.random() * 3000) + 1500,
      negative: Math.floor(Math.random() * 300) + 100,
      neutral: Math.floor(Math.random() * 600) + 300
    }))
  },
  {
    id: '3',
    name: 'Quantum Computing',
    category: 'Technology',
    description: 'Advancements in quantum computing and practical applications',
    strengthScore: 92,
    growthRate: 42,
    mentionVelocity: 3200,
    timeConsistency: 88,
    sources: [
      { name: 'Twitter/X', contribution: 45, icon: '🐦', color: '#1DA1F2' },
      { name: 'Research Papers', contribution: 35, icon: '📚', color: '#FFD166' },
      { name: 'News', contribution: 20, icon: '📰', color: '#45B7D1' }
    ],
    patterns: [
      { type: 'flash', label: 'Flash Trend', description: 'Rapid spike after breakthrough', color: '#EF4444' },
      { type: 'sustained', label: 'Sustained Growth', description: 'Consistent growth over 4+ weeks', color: '#10B981' }
    ],
    riskLevel: 'high',
    riskReasons: ['Early stage technology', 'High entry barriers', 'Unclear ROI timeline'],
    sentiment: { positive: 85, negative: 5, neutral: 10 },
    predictions: {
      growthProbability: 95,
      peakWindow: 'Feb 20 - Mar 30, 2025',
      declineProbability: 45,
      confidence: 'high'
    },
    topKeywords: ['Qubits', 'Superposition', 'Cryptography', 'Drug Discovery', 'Optimization'],
    triggeringEvents: ['Research breakthrough', 'Major investment announcements', 'Government initiatives'],
    sourceDominance: 'Twitter/X (45% contribution)',
    geoDistribution: [
      { region: 'North America', intensity: 95 },
      { region: 'Europe', intensity: 88 },
      { region: 'Asia', intensity: 82 }
    ],
    actionInsights: {
      contentIdeas: [
        'Quantum computing explained',
        'Industry applications',
        'Future predictions'
      ],
      startupIdeas: [
        'Quantum software tools',
        'Educational platforms',
        'Consulting services'
      ],
      researchOpportunities: [
        'Algorithm development',
        'Hardware improvements',
        'Security implications'
      ]
    },
    alerts: [
      { type: 'spike', message: 'Breakthrough announcement caused 500% spike', timestamp: '5 hours ago', priority: 'high' }
    ],
    mentionsTimeline: Array.from({ length: 7 }, (_, i) => ({
      date: `Feb ${10 + i}`,
      count: Math.floor(Math.random() * 8000) + 4000
    })),
    sentimentTimeline: Array.from({ length: 7 }, (_, i) => ({
      date: `Feb ${10 + i}`,
      positive: Math.floor(Math.random() * 5000) + 3000,
      negative: Math.floor(Math.random() * 400) + 100,
      neutral: Math.floor(Math.random() * 1000) + 500
    }))
  }
];

export const getAllTrends = () => mockTrends;
export const getTrendById = (id: string) => mockTrends.find(trend => trend.id === id);
export const getTrendsByCategory = (category: string) => 
  mockTrends.filter(trend => trend.category === category);