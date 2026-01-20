import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { apiClient } from "@/services/api";

import { Navbar } from "../components/Navbar";
import { LoadingScreen } from "../components/LoadingScreen";
import { TrendStrengthMeter } from "../components/TrendStrengthMeter";
import { SourceBadges } from "../components/SourceBadges";
import { PatternTags } from "../components/PatternTags";
import { RiskMeter } from "../components/RiskMeter";
import { PredictionPanel } from "../components/PredictionPanel";
import { WhyTrending } from "../components/WhyTrending";
import { GeoSelector } from "../components/GeoSelector";
import { ActionInsights } from "../components/ActionInsights";
import { AlertCenter } from "../components/AlertCenter";

import {
  ArrowLeft,
  Share2,
  Download,
  Bookmark,
  Shield,
  Info,
  AlertTriangle,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { TooltipInfo } from "../components/TooltipInfo";
import { ConfidenceBadge } from "../components/ConfidenceBadge";

// @ts-ignore
import html2pdf from "html2pdf.js";

const TrendDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedPersona, setSelectedPersona] = useState<
    "student" | "investor" | "creator"
  >("creator");
  const [selectedRegion, setSelectedRegion] = useState("Global");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trend, setTrend] = useState<any>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    const fetchTrend = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      const response = await apiClient.getTrendDetail(id);
      
      if (response.success && response.data) {
        setTrend(response.data.trend);
      } else {
        console.error("Trend fetch error:", response.error);
        setError(response.error || "Failed to fetch trend");
        setTrend(null);
      }

      setLoading(false);
    };

    fetchTrend();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!trend) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold dark:text-white">
              Trend not found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              The requested trend could not be found.
            </p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ SAFE DEFAULTS (so UI never crashes even if Supabase row missing fields)
  const predictions = trend.predictions ?? {
    growthProbability: 0,
    peakWindow: "N/A",
    declineProbability: 0,
    confidence: "low",
  };

  const sources = trend.sources ?? [];
  const patterns = trend.patterns ?? [];
  const topKeywords = trend.topKeywords ?? [];
  const triggeringEvents = trend.triggeringEvents ?? [];
  const sourceDominance = typeof trend.sourceDominance === "string" ? trend.sourceDominance : "";
  const riskReasons = trend.riskReasons ?? [];
  const geoDistribution = trend.geoDistribution ?? [];
  const alerts = trend.alerts ?? [];

  const actionInsights = trend.actionInsights ?? {
    contentIdeas: [],
    startupIdeas: [],
    researchOpportunities: [],
  };

  const mentionsTimeline = trend.mentionsTimeline ?? [];
  const sentiment = trend.sentiment ?? { positive: 0, negative: 0, neutral: 0 };

  const generatePDF = async () => {
    setDownloadingPDF(true);
    try {
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #6366f1; margin-bottom: 10px;">${trend.name}</h1>
          <p style="color: #666; margin-bottom: 30px;">Trend Analysis Report</p>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <h2 style="color: #6366f1; margin-top: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Overview</h2>
          <p><strong>Category:</strong> ${trend.category}</p>
          <p><strong>Description:</strong> ${trend.description}</p>
          <p><strong>Strength Score:</strong> ${trend.strengthScore}/100</p>
          <p><strong>Growth Rate:</strong> ${trend.growthRate}%</p>
          <p><strong>Risk Level:</strong> ${trend.riskLevel}</p>
          
          <h2 style="color: #6366f1; margin-top: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Analysis</h2>
          <p><strong>Patterns:</strong></p>
          <ul>
            ${patterns.map((p: any) => `<li>${p.label}: ${p.description}</li>`).join("")}
          </ul>
          
          <p><strong>Top Keywords:</strong> ${topKeywords.join(", ")}</p>
          
          <h2 style="color: #6366f1; margin-top: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Predictions</h2>
          <p><strong>Growth Probability:</strong> ${predictions.growthProbability}%</p>
          <p><strong>Decline Probability:</strong> ${predictions.declineProbability}%</p>
          <p><strong>Peak Window:</strong> ${predictions.peakWindow}</p>
          <p><strong>Confidence:</strong> ${(predictions.confidence ?? "low").toUpperCase()}</p>
          
          <h2 style="color: #6366f1; margin-top: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Geographic Distribution</h2>
          <ul>
            ${geoDistribution.map((g: any) => `<li>${g.region}: ${g.intensity}/100</li>`).join("")}
          </ul>
          
          <h2 style="color: #6366f1; margin-top: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Risk Assessment</h2>
          <p><strong>Risk Reasons:</strong></p>
          <ul>
            ${riskReasons.map((r: any) => `<li>${r}</li>`).join("")}
          </ul>
          
          <h2 style="color: #6366f1; margin-top: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Data Sources</h2>
          <p>${sources.map((s: any) => s.name).join(", ")}</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
            <p>This report is generated automatically by TrendLytix AI Analysis system.</p>
            <p>Data is based on multiple sources and may contain biases. Use as decision support, not absolute truth.</p>
          </div>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `${trend.name.replace(/\s+/g, "_")}_report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      html2pdf().set(opt).from(element).save();
      setDownloadingPDF(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>

              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-bold dark:text-white">
                      {trend.name}
                    </h1>
                    <TooltipInfo text="Trend names are automatically detected from multiple data sources including social media, news, and search trends." />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {trend.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" title="Bookmark this trend">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="Share this trend">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    title="Download as PDF"
                    onClick={generatePDF}
                    disabled={downloadingPDF}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TrendStrengthMeter
                  score={trend.strengthScore ?? 0}
                  growthRate={trend.growthRate ?? 0}
                  mentionVelocity={trend.mentionVelocity ?? 0}
                  timeConsistency={trend.timeConsistency ?? 0}
                />
                <div className="mt-3">
                  <ConfidenceBadge
                    confidence={predictions.confidence ?? "low"}
                    type="analysis"
                  />
                </div>
              </div>

              <SourceBadges sources={sources} />
            </div>

            {/* Ethics Disclaimer */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">
                    Ethics & Transparency Notice
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    All predictions are probabilistic and based on historical
                    patterns. Data is sampled from public sources and may
                    contain biases. Use insights as decision support, not
                    absolute truth.
                    <span className="block mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <strong>Confidence Level:</strong>{" "}
                      {(predictions.confidence ?? "low").toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="analysis" className="flex items-center gap-1">
                  Analysis
                  <TooltipInfo text="Comprehensive analysis including patterns, trends, and risk factors" />
                </TabsTrigger>

                <TabsTrigger
                  value="predictions"
                  className="flex items-center gap-1"
                >
                  Predictions
                  <TooltipInfo text="Probabilistic forecasts based on historical patterns and current growth" />
                </TabsTrigger>

                <TabsTrigger value="geo" className="flex items-center gap-1">
                  Geography
                  <TooltipInfo text="Regional distribution and intensity of trend mentions" />
                </TabsTrigger>

                <TabsTrigger value="insights" className="flex items-center gap-1">
                  Insights
                  <TooltipInfo text="Actionable recommendations tailored to different personas" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <PatternTags patterns={patterns} />
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Patterns are identified by comparing current growth against
                      historical trend cycles.
                    </div>
                  </div>

                  <WhyTrending
                    topKeywords={topKeywords}
                    triggeringEvents={triggeringEvents}
                    sourceDominance={sourceDominance}
                  />
                </div>

                <RiskMeter
                  riskLevel={trend.riskLevel ?? "low"}
                  riskReasons={riskReasons}
                  saturationLevel={
                    (trend.strengthScore ?? 0) > 85 ? 85 : trend.strengthScore ?? 0
                  }
                  lifespan={
                    (trend.strengthScore ?? 0) > 80
                      ? "short"
                      : (trend.strengthScore ?? 0) > 60
                      ? "medium"
                      : "long"
                  }
                />
              </TabsContent>

              <TabsContent value="predictions">
                <div className="space-y-4">
                  <PredictionPanel
                    growthProbability={predictions.growthProbability ?? 0}
                    peakWindow={predictions.peakWindow ?? "N/A"}
                    declineProbability={predictions.declineProbability ?? 0}
                    confidence={predictions.confidence ?? "low"}
                  />

                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div className="text-sm">
                        <strong>Important:</strong> Forecasts are based on
                        statistical models and historical data. External factors
                        like market events, regulations, or global incidents can
                        significantly impact outcomes.
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="geo">
                <GeoSelector
                  distributions={geoDistribution}
                  selectedRegion={selectedRegion}
                  onRegionChange={setSelectedRegion}
                />
              </TabsContent>

              <TabsContent value="insights">
                <div className="space-y-6">
                  <ActionInsights
                    contentIdeas={actionInsights.contentIdeas}
                    startupIdeas={actionInsights.startupIdeas}
                    researchOpportunities={actionInsights.researchOpportunities}
                    persona={selectedPersona}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={selectedPersona === "student" ? "default" : "outline"}
                      onClick={() => setSelectedPersona("student")}
                      className="relative"
                    >
                      Student
                    </Button>

                    <Button
                      variant={selectedPersona === "investor" ? "default" : "outline"}
                      onClick={() => setSelectedPersona("investor")}
                      className="relative"
                    >
                      Investor
                    </Button>

                    <Button
                      variant={selectedPersona === "creator" ? "default" : "outline"}
                      onClick={() => setSelectedPersona("creator")}
                      className="relative"
                    >
                      Creator
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 dark:text-white flex items-center gap-1">
                  Trend Quick Stats
                  <TooltipInfo text="Key metrics summarizing trend performance and characteristics" />
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      Category
                    </div>
                    <div className="font-medium dark:text-white">
                      {trend.category ?? "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      First Detected
                    </div>
                    <div className="font-medium dark:text-white">Feb 1, 2025</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      Total Mentions
                    </div>
                    <div className="font-medium dark:text-white">
                      {mentionsTimeline.length > 0
                        ? mentionsTimeline
                            .reduce((acc: number, day: any) => acc + (day.count ?? 0), 0)
                            .toLocaleString()
                        : "0"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      Sentiment Score
                    </div>
                    <div className="font-medium dark:text-white">
                      {(sentiment.positive ?? 0) - (sentiment.negative ?? 0) > 0
                        ? "+"
                        : ""}
                      {(sentiment.positive ?? 0) - (sentiment.negative ?? 0)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      Data Sources
                    </div>
                    <div className="font-medium dark:text-white">
                      {sources.length} sources
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AlertCenter alerts={alerts} />

            {/* Data Quality Note */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Data Quality:</strong> Analysis is based on{" "}
                    {sources.length > 0
                      ? sources.map((s: any) => s.name).join(", ")
                      : "N/A"}{" "}
                    data. Coverage may vary by region and source availability.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDetail;
