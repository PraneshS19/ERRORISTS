/**
 * API Client for TrendLytix Local Backend
 * Provides REST API calls to the FastAPI backend running on localhost:8000
 */

const API_BASE = "http://localhost:8000";

export interface TrendData {
  id: string;
  name: string;
  topic?: string;
  category: string;
  domain?: string;
  description: string;
  strengthScore: number;
  trend_score?: number;
  growthRate: number;
  mentionVelocity: number;
  timeConsistency: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  patterns: Array<{
    type: "seasonal" | "flash" | "sustained" | "re-emerging";
    label: string;
    color: string;
    description: string;
  }>;
  sources: Array<{
    name: string;
    contribution: number;
    color: string;
    icon: string;
  }>;
  riskLevel: "low" | "medium" | "high";
  riskReasons: string[];
  predictions: {
    growthProbability: number;
    peakWindow: string;
    declineProbability: number;
    confidence: "low" | "medium" | "high";
  };
  topKeywords: string[];
  triggeringEvents: string[];
  sourceDominance: string;
  geoDistribution: Array<{ region: string; intensity: number }>;
  actionInsights: {
    contentIdeas: string[];
    startupIdeas: string[];
    researchOpportunities: string[];
  };
  alerts: Array<{
    type: "spike" | "decline" | "threshold";
    message: string;
    timestamp: string;
    priority: "low" | "medium" | "high";
  }>;
  mentionsTimeline: Array<{ date: string; count: number }>;
  confidence?: string;
  dataSources?: string[];
  created_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  confidence?: string;
  dataSources?: string[];
  disclaimer?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data as T,
        confidence: data.confidence || "medium",
        dataSources: data.dataSources || ["Local Database"],
        disclaimer: data.disclaimer,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse response: ${error}`,
      };
    }
  }

  /**
   * GET /api/home/trending - Get trending topics for home page
   */
  async getHomeTrending(): Promise<ApiResponse<{ trends: TrendData[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/home/trending`);
      return this.handleResponse<{ trends: TrendData[] }>(response);
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch home trending: ${error}`,
      };
    }
  }

  /**
   * GET /api/dashboard/summary - Get dashboard summary data
   */
  async getDashboardSummary(): Promise<ApiResponse<{ summary: TrendData[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dashboard/summary`);
      return this.handleResponse<{ summary: TrendData[] }>(response);
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch dashboard summary: ${error}`,
      };
    }
  }

  /**
   * GET /api/trends - Get all trends
   */
  async getTrends(): Promise<ApiResponse<{ trends: TrendData[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/trends`);
      return this.handleResponse<{ trends: TrendData[] }>(response);
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch trends: ${error}`,
      };
    }
  }

  /**
   * GET /api/trends/{id} - Get trend detail by ID or topic
   */
  async getTrendDetail(id: string): Promise<ApiResponse<{ trend: TrendData }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/trends/${encodeURIComponent(id)}`);
      return this.handleResponse<{ trend: TrendData }>(response);
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch trend detail: ${error}`,
      };
    }
  }

  /**
   * GET /api/compare - Compare multiple trends
   */
  async compareTrends(topics: string[]): Promise<ApiResponse<{ compare: TrendData[] }>> {
    try {
      const topicsStr = topics.join(",");
      const response = await fetch(
        `${this.baseUrl}/api/compare?topics=${encodeURIComponent(topicsStr)}`
      );
      return this.handleResponse<{ compare: TrendData[] }>(response);
    } catch (error) {
      return {
        success: false,
        error: `Failed to compare trends: ${error}`,
      };
    }
  }

  /**
   * GET /api/alerts - Get trend alerts
   */
  async getAlerts(): Promise<ApiResponse<{ alerts: any[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alerts`);
      return this.handleResponse<{ alerts: any[] }>(response);
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch alerts: ${error}`,
      };
    }
  }

  /**
   * POST /api/reports/generate - Generate report
   */
  async generateReport(topics: string[]): Promise<ApiResponse<{ report: TrendData[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topics),
      });
      return this.handleResponse<{ report: TrendData[] }>(response);
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate report: ${error}`,
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
