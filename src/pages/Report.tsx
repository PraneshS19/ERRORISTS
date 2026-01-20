import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { FileText, Download, Calendar, Filter, BarChart, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { apiClient } from "@/services/api";

// @ts-ignore
import html2pdf from "html2pdf.js";

type ReportRow = {
  id: string;
  user_id: string | null;

  report_type: string; // daily/weekly/monthly/custom
  format: string; // pdf/excel/csv/html

  include_executive_summary: boolean;
  include_trend_analysis: boolean;
  include_growth_metrics: boolean;
  include_risk_assessment: boolean;
  include_competitive_analysis: boolean;
  include_recommendations: boolean;

  from_date: string;
  to_date: string;

  status: "pending" | "generated" | "failed";

  file_url: string | null;

  created_at: string;
};

const Report = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trends, setTrends] = useState<any[]>([]);

  // form states
  const [reportType, setReportType] = useState("weekly");
  const [format, setFormat] = useState("pdf");

  const [includeExecutiveSummary, setIncludeExecutiveSummary] = useState(true);
  const [includeTrendAnalysis, setIncludeTrendAnalysis] = useState(true);
  const [includeGrowthMetrics, setIncludeGrowthMetrics] = useState(true);
  const [includeRiskAssessment, setIncludeRiskAssessment] = useState(true);
  const [includeCompetitiveAnalysis, setIncludeCompetitiveAnalysis] =
    useState(false);
  const [includeRecommendations, setIncludeRecommendations] = useState(false);

  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-01-07");

  // recent reports
  const [recentReports, setRecentReports] = useState<ReportRow[]>([]);

  const fetchTrends = async () => {
    const response = await apiClient.getTrends();
    if (response.success && response.data) {
      setTrends(response.data);
    }
  };

  const fetchRecentReports = async () => {
    setLoading(true);
    setError(null);

    // Load reports from localStorage (academic demo)
    const savedReports = localStorage.getItem('trendlytix_reports');
    if (savedReports) {
      try {
        const reports = JSON.parse(savedReports) as ReportRow[];
        setRecentReports(reports.slice(0, 10));
      } catch (e) {
        console.error("Failed to load reports:", e);
      }
    }

    setLoading(false);
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    if (!fromDate || !toDate) {
      alert("Please select date range.");
      setLoading(false);
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      alert("From date cannot be after To date.");
      setLoading(false);
      return;
    }

    // Generate HTML content for the report
    const reportContent = `
      <div style="padding: 40px; font-family: Arial, sans-serif; color: #333; max-width: 900px;">
        <div style="border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin: 0;">TrendLytix Report</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Period: ${fromDate} to ${toDate}</p>
        </div>

        ${includeExecutiveSummary ? `
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-top: 30px;">Executive Summary</h2>
          <p>This report analyzes trending topics over the selected period (${fromDate} to ${toDate}). 
          The analysis is based on ${trends.length} tracked trends across multiple categories and data sources.</p>
          <ul>
            <li>Total Trends Analyzed: ${trends.length}</li>
            <li>Average Strength Score: ${trends.length > 0 ? Math.round(trends.reduce((acc: number, t: any) => acc + (t.strengthScore || 0), 0) / trends.length) : 0}/100</li>
            <li>High Growth Trends: ${trends.filter((t: any) => (t.growthRate || 0) > 20).length}</li>
            <li>Report Generated: ${new Date().toLocaleDateString()}</li>
          </ul>
        ` : ""}

        ${includeTrendAnalysis ? `
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-top: 30px;">Trend Analysis</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Trend</th>
                <th style="border: 1px solid #ddd; padding: 10px;">Category</th>
                <th style="border: 1px solid #ddd; padding: 10px;">Strength</th>
                <th style="border: 1px solid #ddd; padding: 10px;">Growth %</th>
              </tr>
            </thead>
            <tbody>
              ${trends.slice(0, 10).map((t: any) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;">${t.name}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${t.category}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${t.strengthScore}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${t.growthRate}%</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}

        ${includeGrowthMetrics ? `
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-top: 30px;">Growth Metrics</h2>
          <ul>
            <li>Emerging Trends (Growth > 20%): ${trends.filter((t: any) => (t.growthRate || 0) > 20).length}</li>
            <li>Stable Trends (Growth 0-20%): ${trends.filter((t: any) => (t.growthRate || 0) <= 20 && (t.growthRate || 0) > 0).length}</li>
            <li>Declining Trends (Growth < 0%): ${trends.filter((t: any) => (t.growthRate || 0) < 0).length}</li>
          </ul>
        ` : ""}

        ${includeRiskAssessment ? `
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-top: 30px;">Risk Assessment</h2>
          <ul>
            <li>High Risk Trends: ${trends.filter((t: any) => t.riskLevel === "high").length}</li>
            <li>Medium Risk Trends: ${trends.filter((t: any) => t.riskLevel === "medium").length}</li>
            <li>Low Risk Trends: ${trends.filter((t: any) => t.riskLevel === "low").length}</li>
          </ul>
        ` : ""}

        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #999; font-size: 12px;">
          <p>This report is generated automatically by TrendLytix AI Analysis System.</p>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p><strong>Disclaimer:</strong> Data is based on multiple sources and may contain biases. Use as decision support, not absolute truth.</p>
        </div>
      </div>
    `;

    // Generate PDF if format is PDF
    if (format === "pdf") {
      try {
        const element = document.createElement("div");
        element.innerHTML = reportContent;

        const opt = {
          margin: 10,
          filename: `TrendLytix_Report_${new Date().getTime()}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
        };

        await html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error("PDF generation failed:", err);
        setError("Failed to generate PDF");
      }
    }

    // Create report record
    const newReport: ReportRow = {
      id: `report_${Date.now()}`,
      user_id: localStorage.getItem('trendlytix_user') ? JSON.parse(localStorage.getItem('trendlytix_user') || '{}').id : null,
      report_type: reportType,
      format: format,
      include_executive_summary: includeExecutiveSummary,
      include_trend_analysis: includeTrendAnalysis,
      include_growth_metrics: includeGrowthMetrics,
      include_risk_assessment: includeRiskAssessment,
      include_competitive_analysis: includeCompetitiveAnalysis,
      include_recommendations: includeRecommendations,
      from_date: fromDate,
      to_date: toDate,
      status: "generated",
      file_url: null,
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
    const savedReports = localStorage.getItem('trendlytix_reports');
    const allReports: ReportRow[] = savedReports ? JSON.parse(savedReports) : [];
    allReports.unshift(newReport);
    localStorage.setItem('trendlytix_reports', JSON.stringify(allReports));

    alert("✅ Report generated and downloaded successfully!");
    await fetchRecentReports();
    setLoading(false);
  };

  const handleDownload = (report: ReportRow) => {
    // Create a blob from the report data
    const reportContent = `
      Report ID: ${report.id}
      Type: ${report.report_type}
      Period: ${report.from_date} to ${report.to_date}
      Generated: ${report.created_at}
      Status: ${report.status}
    `;
    
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${report.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const setLast7Days = () => {
    const today = new Date();
    const to = today.toISOString().slice(0, 10);

    const fromObj = new Date();
    fromObj.setDate(today.getDate() - 7);
    const from = fromObj.toISOString().slice(0, 10);

    setFromDate(from);
    setToDate(to);
    setReportType("weekly");
  };

  const setLast30Days = () => {
    const today = new Date();
    const to = today.toISOString().slice(0, 10);

    const fromObj = new Date();
    fromObj.setDate(today.getDate() - 30);
    const from = fromObj.toISOString().slice(0, 10);

    setFromDate(from);
    setToDate(to);
    setReportType("monthly");
  };

  const deleteReport = (reportId: string) => {
    const savedReports = localStorage.getItem('trendlytix_reports');
    if (savedReports) {
      const allReports: ReportRow[] = JSON.parse(savedReports);
      const filtered = allReports.filter(r => r.id !== reportId);
      localStorage.setItem('trendlytix_reports', JSON.stringify(filtered));
      fetchRecentReports();
    }
  };

  useEffect(() => {
    fetchTrends();
    fetchRecentReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold dark:text-white">
            Generate Report
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Create detailed trend analysis reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <FileText className="w-5 h-5" />
                  Report Configuration
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">
                        Report Type
                      </label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="daily">Daily Summary</SelectItem>
                          <SelectItem value="weekly">Weekly Analysis</SelectItem>
                          <SelectItem value="monthly">Monthly Report</SelectItem>
                          <SelectItem value="custom">Custom Period</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">
                        Format
                      </label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                          <SelectItem value="html">HTML Webpage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Include Sections */}
                  <div className="space-y-4">
                    <h3 className="font-medium dark:text-white">
                      Include Sections
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={includeExecutiveSummary}
                          onChange={(e) =>
                            setIncludeExecutiveSummary(e.target.checked)
                          }
                        />
                        <span className="dark:text-gray-300">
                          Executive Summary
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={includeTrendAnalysis}
                          onChange={(e) =>
                            setIncludeTrendAnalysis(e.target.checked)
                          }
                        />
                        <span className="dark:text-gray-300">
                          Trend Analysis
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={includeGrowthMetrics}
                          onChange={(e) =>
                            setIncludeGrowthMetrics(e.target.checked)
                          }
                        />
                        <span className="dark:text-gray-300">
                          Growth Metrics
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={includeRiskAssessment}
                          onChange={(e) =>
                            setIncludeRiskAssessment(e.target.checked)
                          }
                        />
                        <span className="dark:text-gray-300">
                          Risk Assessment
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={includeCompetitiveAnalysis}
                          onChange={(e) =>
                            setIncludeCompetitiveAnalysis(e.target.checked)
                          }
                        />
                        <span className="dark:text-gray-300">
                          Competitive Analysis
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={includeRecommendations}
                          onChange={(e) =>
                            setIncludeRecommendations(e.target.checked)
                          }
                        />
                        <span className="dark:text-gray-300">
                          Recommendations
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-4">
                    <h3 className="font-medium dark:text-white">Date Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm dark:text-gray-300">
                          From
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm dark:text-gray-300">To</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2"
                    onClick={generateReport}
                    disabled={loading}
                  >
                    <FileText className="w-4 h-4" />
                    {loading ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & History */}
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Reports</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {recentReports.length === 0 ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No reports created yet.
                    </div>
                  ) : (
                    recentReports.slice(0, 5).map((r) => (
                      <div
                        key={r.id}
                        className="p-3 border rounded-lg dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium dark:text-white">
                              {r.report_type.toUpperCase()} Report
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {r.from_date} → {r.to_date} •{" "}
                              {r.format.toUpperCase()} • {r.status}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(r)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Quick Actions</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={setLast7Days}
                  >
                    <Calendar className="w-4 h-4" />
                    Last 7 Days Report
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={setLast30Days}
                  >
                    <Calendar className="w-4 h-4" />
                    Last 30 Days Report
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      const today = new Date().toISOString().slice(0, 10);
                      setFromDate(today);
                      setToDate(today);
                      setReportType("daily");
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    Today's Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
