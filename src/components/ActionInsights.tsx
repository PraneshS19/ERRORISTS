import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, Rocket, BookOpen, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ActionInsightsProps {
  contentIdeas: string[];
  startupIdeas: string[];
  researchOpportunities: string[];
  persona?: 'student' | 'investor' | 'creator';
}

export const ActionInsights: React.FC<ActionInsightsProps> = ({
  contentIdeas,
  startupIdeas,
  researchOpportunities,
  persona = 'creator'
}) => {
  const personaConfig = {
    student: {
      icon: BookOpen,
      title: 'Student Insights',
      description: 'Academic and research opportunities'
    },
    investor: {
      icon: Users,
      title: 'Investor Insights',
      description: 'Market opportunities and investment potential'
    },
    creator: {
      icon: Rocket,
      title: 'Creator Insights',
      description: 'Content creation and audience engagement'
    }
  };

  const PersonaIcon = personaConfig[persona].icon;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Lightbulb className="w-5 h-5" />
          Action-Oriented Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PersonaIcon className="w-4 h-4" />
            <div>
              <div className="font-medium dark:text-white">{personaConfig[persona].title}</div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">{personaConfig[persona].description}</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="content">Content Ideas</TabsTrigger>
            <TabsTrigger value="startup">Startup Ideas</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-3">
            <div className="space-y-2">
              {contentIdeas.map((idea, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted dark:bg-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <span className="text-sm dark:text-gray-300">{idea}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="startup" className="space-y-3">
            <div className="space-y-2">
              {startupIdeas.map((idea, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted dark:bg-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <span className="text-sm dark:text-gray-300">{idea}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="research" className="space-y-3">
            <div className="space-y-2">
              {researchOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted dark:bg-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <span className="text-sm dark:text-gray-300">{opportunity}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="text-sm">
            <div className="font-medium text-purple-800 dark:text-purple-300">Opportunity Mapping</div>
            <div className="text-purple-700 dark:text-purple-400 mt-1">
              Based on trend strength, sentiment, and growth patterns, these insights are 
              specifically tailored for {persona}s looking to capitalize on this trend.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};