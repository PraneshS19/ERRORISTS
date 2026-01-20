import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { getAllTrends } from '../data/mockTrends';
import { ArrowUp, ArrowDown, TrendingUp, Sparkles, Zap, Shield, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [trends] = useState(getAllTrends().slice(0, 6));
  const navigate = useNavigate();

  const getStrengthLabel = (score: number) => {
    if (score < 30) return { label: 'Weak', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
    if (score < 60) return { label: 'Emerging', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' };
    return { label: 'Strong', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' };
  };

  const getDirectionIcon = (growth: number) => {
    if (growth > 15) return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 text-gray-500">→</span>;
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Trend Detection',
      description: 'Real-time identification of emerging patterns',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Deep analysis using advanced algorithms',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: Zap,
      title: 'Predictive Analytics',
      description: 'Probabilistic forecasting with confidence scores',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Comprehensive risk analysis and mitigation',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 dark:text-white">
          Discover What's <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Trending</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          AI-powered trend discovery platform. Monitor, analyze, and capitalize on emerging patterns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => navigate('/dashboard')}
          >
            Explore Trends
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 dark:border-gray-600"
            onClick={() => navigate('/login')}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login for Analysis
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Powerful Analytics Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Trending Now Section - Now the final section */}
      <div className="container mx-auto px-4 py-12 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold dark:text-white">Trending Now</h2>
          <p className="text-gray-600 dark:text-gray-400">Discover emerging patterns across industries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((trend) => {
            const strength = getStrengthLabel(trend.strengthScore);
            return (
              <Card 
                key={trend.id} 
                className="border dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg dark:text-white">{trend.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{trend.category}</p>
                    </div>
                    <div className="flex items-center gap-2 pl-4">
                      {getDirectionIcon(trend.growthRate)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${strength.bg} ${strength.color}`}>
                        {strength.label}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {trend.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {trend.patterns.slice(0, 2).map((pattern, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full border font-medium"
                        style={{ 
                          backgroundColor: `${pattern.color}15`,
                          borderColor: `${pattern.color}50`,
                          color: pattern.color
                        }}
                      >
                        {pattern.label}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-2"
                      onClick={() => navigate('/login')}
                    >
                      <LogIn className="w-4 h-4" />
                      Login for Full Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;