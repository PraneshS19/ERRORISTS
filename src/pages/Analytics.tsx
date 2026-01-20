import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { LoadingScreen } from "../components/LoadingScreen";

import { apiClient } from "@/services/api";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import { TrendingUp, TrendingDown, Globe, Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";

const Analytics = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredTrends, setFilteredTrends] = useState<any[]>([]);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);

    const response = await apiClient.getTrends();
    
    if (response.success && response.data) {
      setTrends(response.data.trends || response.data || []);
    } else {
      console.error("Analytics trends fetch error:", response.error);
      setError(response.error || "Failed to fetch trends");
      setTrends([]);
    }

    setLoading(false);
  };

  // Apply filters when category or time range changes
  useEffect(() => {
    let filtered = trends;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    setFilteredTrends(filtered);
  }, [selectedCategory, trends, timeRange]);

  useEffect(() => {
    fetchTrends();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // If empty DB
  if (!trends || trends.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold dark:text-white">
                No trends found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Trends will appear here once the API has data. {error && `Error: ${error}`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------
  // Analytics Calculations (safe) using filteredTrends
  // ----------------------------

  const categoryData = filteredTrends.reduce((acc, trend) => {
    const cat = trend.category || "Unknown";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const strengthData = filteredTrends
    .map((trend) => ({
      name:
        (trend.name ? String(trend.name).substring(0, 12) : "Trend") + "...",
      strength: trend.strengthScore || 0,
      growth: trend.growthRate || 0,
    }))
    .sort((a, b) => b.strength - a.strength);

  const sentimentData = [
    {
      name: "Positive",
      value:
        filteredTrends.reduce((acc, t) => acc + (t.sentiment?.positive || 0), 0) /
        (filteredTrends.length || 1),
    },
    {
      name: "Negative",
      value:
        filteredTrends.reduce((acc, t) => acc + (t.sentiment?.negative || 0), 0) /
        (filteredTrends.length || 1),
    },
    {
      name: "Neutral",
      value:
        filteredTrends.reduce((acc, t) => acc + (t.sentiment?.neutral || 0), 0) /
        (filteredTrends.length || 1),
    },
  ];

  const patternData = filteredTrends
    .flatMap((trend) => (trend.patterns || []).map((pattern: any) => pattern.type))
    .reduce((acc: Record<string, number>, type: string) => {
      const key = type || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const patternChartData = Object.entries(patternData).map(([name, value]) => ({
    subject: name.charAt(0).toUpperCase() + name.slice(1),
    count: value,
    fullMark: filteredTrends.length,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive analytics and insights across {filteredTrends.length} trend{filteredTrends.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Section */}
          <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium dark:text-gray-300 block mb-2">
                    Filter by Category
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option>All</option>
                    {Array.from(new Set(trends.map((t) => t.category))).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All");
                    setTimeRange("7d");
                  }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Trends
                  </div>
                  <div className="text-3xl font-bold mt-2 dark:text-white">
                    {trends.length}
                  </div>
                  <div className="flex items-center mt-2 text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12% from last week</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-500/20">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Avg Strength
                  </div>
                  <div className="text-3xl font-bold mt-2 dark:text-white">
                    {Math.round(
                      trends.reduce((acc, t) => acc + (t.strengthScore || 0), 0) /
                        trends.length
                    )}
                  </div>
                  <div className="flex items-center mt-2 text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+8% from last week</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-500/20">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    High Risk Trends
                  </div>
                  <div className="text-3xl font-bold mt-2 dark:text-white">
                    {trends.filter((t) => t.riskLevel === "high").length}
                  </div>
                  <div className="flex items-center mt-2 text-red-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span className="text-sm">+2 from last week</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-red-500/20">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Active Sources
                  </div>
                  <div className="text-3xl font-bold mt-2 dark:text-white">
                    {
                      new Set(
                        trends.flatMap((t) =>
                          (t.sources || []).map((s: any) => s.name)
                        )
                      ).size
                    }
                  </div>
                  <div className="flex items-center mt-2 text-green-500">
                    <Globe className="w-4 h-4 mr-1" />
                    <span className="text-sm">Covering all regions</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Globe className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strength Distribution */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Trend Strength Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                      labelStyle={{ color: "#F9FAFB" }}
                    />
                    <Legend />
                    <Bar dataKey="strength" fill="#3B82F6" name="Strength Score" />
                    <Bar dataKey="growth" fill="#10B981" name="Growth Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Overall Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                      labelStyle={{ color: "#F9FAFB" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Distribution */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Pattern Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={patternChartData}
                  >
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
                    <PolarRadiusAxis stroke="#9CA3AF" />
                    <Radar
                      name="Patterns"
                      dataKey="count"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
