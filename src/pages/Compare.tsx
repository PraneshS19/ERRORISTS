import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { LoadingScreen } from "../components/LoadingScreen";
import { apiClient } from "@/services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";

type TrendRow = {
  id: string;
  name: string;
  category: string;
  strengthScore: number;
  growthRate: number;
  mentionVelocity: number;

  riskLevel: "low" | "medium" | "high";

  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };

  predictions: {
    growthProbability: number;
    declineProbability?: number;
    peakWindow?: string;
    confidence?: string;
  };

  sources: {
    name: string;
    contribution: number;
  }[];
};

const Compare = () => {
  const [trends, setTrends] = useState<TrendRow[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);

    const response = await apiClient.getTrends();
    
    if (response.success && response.data) {
      const safeData = (response.data.trends || []) as TrendRow[];
      setTrends(safeData);

      // set default selected trends (first 2)
      if (safeData.length >= 2 && selectedTrends.length === 0) {
        setSelectedTrends([safeData[0].id, safeData[1].id]);
      } else if (safeData.length === 1 && selectedTrends.length === 0) {
        setSelectedTrends([safeData[0].id]);
      }
    } else {
      console.error("Failed to fetch trends:", response.error);
      setError(response.error || "Failed to fetch trends");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compareData = useMemo(() => {
    return selectedTrends
      .map((id) => trends.find((t) => t.id === id))
      .filter(Boolean) as TrendRow[];
  }, [selectedTrends, trends]);

  const sentimentData = useMemo(() => {
    return compareData.map((trend) => ({
      name: trend?.name,
      positive: trend?.sentiment?.positive ?? 0,
      negative: trend?.sentiment?.negative ?? 0,
      neutral: trend?.sentiment?.neutral ?? 0,
    }));
  }, [compareData]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">
            Trend Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Compare multiple trends side-by-side for better decision making
          </p>
        </div>

        {/* Trend Selector */}
        <div className="mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={selectedTrends[0] || ""}
                  onValueChange={(v) =>
                    setSelectedTrends([v, selectedTrends[1]].filter(Boolean))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select first trend" />
                  </SelectTrigger>
                  <SelectContent>
                    {trends.map((trend) => (
                      <SelectItem key={trend.id} value={trend.id}>
                        {trend.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedTrends[1] || ""}
                  onValueChange={(v) =>
                    setSelectedTrends([selectedTrends[0], v].filter(Boolean))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select second trend" />
                  </SelectTrigger>
                  <SelectContent>
                    {trends.map((trend) => (
                      <SelectItem key={trend.id} value={trend.id}>
                        {trend.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    const available = trends.filter(
                      (t) => !selectedTrends.includes(t.id)
                    );
                    if (available.length > 0) {
                      setSelectedTrends([...selectedTrends, available[0].id]);
                    }
                  }}
                  disabled={trends.length === 0}
                >
                  Add Another
                </Button>
              </div>

              {trends.length === 0 && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  No trends found in database. Add data into Supabase table
                  <b> trends</b>.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strength Comparison */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Strength Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compareData}>
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
                    <Bar
                      dataKey="strengthScore"
                      fill="#3B82F6"
                      name="Strength Score"
                    />
                    <Bar dataKey="growthRate" fill="#10B981" name="Growth Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Comparison */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData}>
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
                    <Line
                      type="monotone"
                      dataKey="positive"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="negative"
                      stroke="#EF4444"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="neutral"
                      stroke="#6B7280"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Comparison */}
          <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Detailed Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 dark:text-gray-300">
                        Metric
                      </th>
                      {compareData.map((trend, index) => (
                        <th
                          key={index}
                          className="text-left py-3 px-4 dark:text-gray-300"
                        >
                          {trend?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 dark:text-gray-300">Category</td>
                      {compareData.map((trend, index) => (
                        <td
                          key={index}
                          className="py-3 px-4 dark:text-gray-300"
                        >
                          {trend?.category}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 dark:text-gray-300">
                        Strength Score
                      </td>
                      {compareData.map((trend, index) => (
                        <td
                          key={index}
                          className="py-3 px-4 dark:text-gray-300"
                        >
                          <span className="font-bold">
                            {trend?.strengthScore}/100
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 dark:text-gray-300">Risk Level</td>
                      {compareData.map((trend, index) => (
                        <td
                          key={index}
                          className="py-3 px-4 dark:text-gray-300"
                        >
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              trend?.riskLevel === "high"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : trend?.riskLevel === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {trend?.riskLevel}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 dark:text-gray-300">
                        Growth Probability
                      </td>
                      {compareData.map((trend, index) => (
                        <td
                          key={index}
                          className="py-3 px-4 dark:text-gray-300"
                        >
                          <span className="font-bold">
                            {trend?.predictions?.growthProbability ?? 0}%
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 dark:text-gray-300">
                        Primary Source
                      </td>
                      {compareData.map((trend, index) => (
                        <td
                          key={index}
                          className="py-3 px-4 dark:text-gray-300"
                        >
                          {trend?.sources?.[0]?.name
                            ? `${trend.sources[0].name} (${trend.sources[0].contribution}%)`
                            : "N/A"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Compare;
