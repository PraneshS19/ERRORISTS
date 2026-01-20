import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "@/services/api";

import { Navbar } from "../components/Navbar";
import { LoadingScreen } from "../components/LoadingScreen";

import {
  TrendingUp,
  Activity,
  AlertTriangle,
  BarChart3,
  GitCompare,
  FileText,
  PieChart,
  Filter,
  ChevronRight,
  Lock,
  ArrowUp,
  Circle,
  CheckCircle,
  XCircle,
  Unlock,
  Shield,
  X,
  Search,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const Dashboard = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllTrends, setShowAllTrends] = useState(false);
  const [filteredTrends, setFilteredTrends] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const navigate = useNavigate();

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    
    const response = await apiClient.getDashboardSummary();
    
    if (response.success && response.data) {
      setTrends(response.data.summary || []);
      setFilteredTrends(response.data.summary || []);
    } else {
      console.error("Failed to fetch trends:", response.error);
      setError(response.error || "Failed to fetch trends");
      setTrends([]);
      setFilteredTrends([]);
    }
    
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = trends;

    // Apply category filter
    if (filterCategory !== "All") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTrends(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterCategory, trends]);

  // Check authentication
  const isAuthenticated = !!localStorage.getItem("trendlytix_token");

  // Calculate KPIs
  const activeTrends = trends.length;

  const avgStrength =
    trends.length > 0
      ? Math.round(
          trends.reduce((acc, t) => acc + (t.strengthScore || 0), 0) /
            trends.length
        )
      : 0;

  const highGrowthCount = trends.filter((t) => (t.growthRate || 0) > 20).length;

  const overallSentiment =
    trends.length > 0
      ? Math.round(
          (trends.reduce((acc, t) => acc + (t.sentiment?.positive || 0), 0) /
            trends.length) -
            (trends.reduce((acc, t) => acc + (t.sentiment?.negative || 0), 0) /
              trends.length)
        )
      : 0;

  // Get trend growth label
  const getGrowthLabel = (growthRate: number) => {
    if (growthRate > 20)
      return {
        label: "Emerging",
        color: "text-green-600",
        bg: "bg-green-100 dark:bg-green-900/30",
      };
    if (growthRate > 0)
      return {
        label: "Stable",
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/30",
      };
    return {
      label: "Declining",
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
    };
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // If not authenticated, show locked dashboard with only trends
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Header with explore mode indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold dark:text-white">
                  Trend Explorer
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Explore trending insights. Sign in to unlock full dashboard.
                </p>
              </div>
              <Badge variant="outline" className="gap-2 py-1.5 px-3">
                <Shield className="w-3 h-3" />
                Explore Mode
              </Badge>
            </div>
          </div>

          {/* Full-screen locked overlay warning */}
          <Card className="mb-8 border-l-4 border-l-blue-500 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold dark:text-white mb-1">
                    Dashboard Locked
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You're currently in explore mode. Sign in to unlock all
                    dashboard features including analytics, detailed reports,
                    trend comparisons, and advanced filtering.
                  </p>
                  <Button onClick={() => navigate("/login")} className="gap-2">
                    <Unlock className="w-4 h-4" />
                    Sign In to Unlock Full Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessible Trends Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold dark:text-white">
                Trends Explorer
              </h2>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available in Explore Mode
              </Badge>
            </div>

            {/* Trends Filters - Limited in explore mode */}
            <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="w-4 h-4" />
                  Explore Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium dark:text-gray-300 mb-1 block">
                      Category
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option>All Categories</option>
                      {Array.from(new Set(trends.map((t) => t.category))).map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium dark:text-gray-300 mb-1 block">
                      Time Range
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracked Trends List - Always Accessible */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Tracked Trends ({trends.length})</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sorted by Strength
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trends.slice(0, 8).map((trend) => {
                    const growth = getGrowthLabel(trend.growthRate || 0);

                    return (
                      <div
                        key={trend.id}
                        className="p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                        onClick={() => {
                          alert(
                            `Trend: ${trend.name}\nStrength: ${trend.strengthScore}\nCategory: ${trend.category}\n\nSign in for detailed analysis.`
                          );
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm dark:text-white truncate">
                                  {trend.name}
                                </h4>
                                {(trend.alerts || []).length > 0 && (
                                  <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {trend.category}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${growth.bg} ${growth.color}`}
                                >
                                  {growth.label}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                  Strength: {trend.strengthScore}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Locked Features Preview */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold dark:text-white mb-2">
                Unlock Full Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Sign in to access advanced features that help you make
                data-driven decisions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Advanced Analytics",
                  description: "Deep dive into trend metrics and insights",
                  locked: true,
                },
                {
                  icon: <GitCompare className="w-6 h-6" />,
                  title: "Trend Comparison",
                  description: "Compare multiple trends side by side",
                  locked: true,
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: "Smart Reports",
                  description: "Generate automated trend reports",
                  locked: true,
                },
                {
                  icon: <AlertTriangle className="w-6 h-6" />,
                  title: "Real-time Alerts",
                  description: "Get notified about trend changes",
                  locked: true,
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="dark:bg-gray-800 dark:border-gray-700 border-dashed relative"
                  style={{ opacity: 0.7 }}
                >
                  <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-gray-400">{feature.icon}</div>
                    </div>
                    <h3 className="font-semibold dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Unlock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white mb-3">
                    Ready to unlock full potential?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Sign in now to access complete trend analysis, personalized
                    insights, and advanced reporting tools.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      size="lg"
                      onClick={() => navigate("/login")}
                      className="gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      Sign In Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate("/signup")}
                    >
                      Create Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Trend Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            AI-powered trend monitoring and analysis command center
          </p>
        </div>

        {/* Executive Summary - KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Trends KPI */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                >
                  <ArrowUp className="w-3 h-3 mr-1" /> +12%
                </Badge>
              </div>
              <div className="text-2xl font-bold dark:text-white">
                {activeTrends}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Active Trends
              </div>
            </CardContent>
          </Card>

          {/* Average Strength KPI */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                >
                  <ArrowUp className="w-3 h-3 mr-1" /> +8%
                </Badge>
              </div>
              <div className="text-2xl font-bold dark:text-white">
                {avgStrength}
                <span className="text-sm text-gray-500">/100</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Avg Strength Score
              </div>
            </CardContent>
          </Card>

          {/* High Growth Trends KPI */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                >
                  <ArrowUp className="w-3 h-3 mr-1" /> +3
                </Badge>
              </div>
              <div className="text-2xl font-bold dark:text-white">
                {highGrowthCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                High Growth Trends
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Balance KPI */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <BarChart3 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <Badge
                  variant="outline"
                  className={
                    overallSentiment > 0
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }
                >
                  {overallSentiment > 0 ? "+" : ""}
                  {overallSentiment}
                </Badge>
              </div>
              <div className="text-2xl font-bold dark:text-white">
                {overallSentiment > 0 ? "+" : ""}
                {overallSentiment}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Net Sentiment Balance
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Body - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters Panel */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium dark:text-gray-300 mb-1 block">
                      Category
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option>All Categories</option>
                      {Array.from(new Set(trends.map((t) => t.category))).map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium dark:text-gray-300 mb-1 block">
                      Time Range
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracked Trends List */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <span>Tracked Trends ({trends.length})</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sorted by Strength
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trends.slice(0, 5).map((trend) => {
                    const growth = getGrowthLabel(trend.growthRate || 0);
                    const hasAlerts = (trend.alerts || []).length > 0;

                    return (
                      <div
                        key={trend.id}
                        className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700"
                        onClick={() => navigate(`/trend/${trend.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm dark:text-white truncate">
                                  {trend.name}
                                </h4>
                                {hasAlerts && (
                                  <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {trend.category}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${growth.bg} ${growth.color}`}
                                >
                                  {growth.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold text-sm dark:text-white">
                                {trend.strengthScore}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Score
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-sm"
                    onClick={() => setShowAllTrends(true)}
                  >
                    View all trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Smart Alerts Panel */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  Smart Alerts
                  {trends
                    .flatMap((t) => t.alerts || [])
                    .filter((a) => a.priority === "high").length > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {
                        trends
                          .flatMap((t) => t.alerts || [])
                          .filter((a) => a.priority === "high").length
                      }
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trends.flatMap((t) => t.alerts || []).length > 0 ? (
                    trends
                      .flatMap((t) => t.alerts || [])
                      .slice(0, 3)
                      .map((alert, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            alert.priority === "high"
                              ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                              : alert.priority === "medium"
                              ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20"
                              : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {alert.priority === "high" ? (
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            ) : alert.priority === "medium" ? (
                              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-blue-500 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium text-sm dark:text-white">
                                {alert.message}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {alert.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        No active alerts
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        All systems normal
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm"
                    onClick={() => navigate("/alerts")}
                  >
                    Manage Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="w-4 h-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => navigate("/trend/1")}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analyze a Trend
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => navigate("/compare")}
                  >
                    <GitCompare className="w-4 h-4" />
                    Compare Trends
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => navigate("/report")}
                  >
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => navigate("/analytics")}
                  >
                    <PieChart className="w-4 h-4" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Visual Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strength Distribution */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Strength Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    label: "Saturated",
                    count: trends.filter((t) => t.strengthScore >= 85).length,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Strong",
                    count: trends.filter(
                      (t) => t.strengthScore >= 60 && t.strengthScore < 85
                    ).length,
                    color: "bg-green-500",
                  },
                  {
                    label: "Emerging",
                    count: trends.filter(
                      (t) => t.strengthScore >= 30 && t.strengthScore < 60
                    ).length,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Weak",
                    count: trends.filter((t) => t.strengthScore < 30).length,
                    color: "bg-red-500",
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="dark:text-gray-300">{item.label}</span>
                      <span className="font-medium dark:text-white">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{
                          width: `${
                            trends.length > 0
                              ? (item.count / trends.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <PieChart className="w-4 h-4" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(trends.map((t) => t.category))).map(
                  (cat) => {
                    const count = trends.filter((t) => t.category === cat).length;
                    return (
                      <div key={cat} className="flex items-center justify-between">
                        <span className="text-sm dark:text-gray-300">{cat}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                              style={{
                                width: `${
                                  trends.length > 0
                                    ? (count / trends.length) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium dark:text-white w-8 text-right">
                            {trends.length > 0
                              ? Math.round((count / trends.length) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View All Trends Modal */}
        <Dialog open={showAllTrends} onOpenChange={setShowAllTrends}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">All Trends ({filteredTrends.length})</DialogTitle>
              <DialogDescription>
                Browse and filter all tracked trends by category
              </DialogDescription>
            </DialogHeader>

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      placeholder="Search trends..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <select
                  className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  {Array.from(new Set(trends.map((t) => t.category))).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trends Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTrends.length > 0 ? (
                  filteredTrends.map((trend) => {
                    const growth = trend.growthRate > 20 
                      ? { label: "Emerging", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" }
                      : trend.growthRate > 0
                      ? { label: "Stable", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" }
                      : { label: "Declining", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" };

                    return (
                      <div
                        key={trend.id}
                        className="p-4 border rounded-lg cursor-pointer transition-all hover:shadow-lg hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-gray-700/30"
                        onClick={() => {
                          setShowAllTrends(false);
                          navigate(`/trend/${trend.id}`);
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold dark:text-white truncate">{trend.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{trend.category}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${growth.bg} ${growth.color} flex-shrink-0 ml-2`}>
                            {growth.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold dark:text-white">{trend.strengthScore}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Strength Score</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium dark:text-gray-300">{trend.growthRate}%</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Growth Rate</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No trends found matching your filters</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
