import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Bell, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { apiClient } from "@/services/api";

type AlertSettingRow = {
  id: string;
  user_id: string | null;

  email_notifications: boolean;
  browser_notifications: boolean;
  mobile_notifications: boolean;

  trend_spike_threshold: number; // %
  mention_velocity_threshold: number; // daily count

  created_at?: string;
};

type AlertRow = {
  id: string;
  user_id: string | null;

  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  type?: "spike" | "decline" | "threshold";
  timestamp: string;
};

const Alerts = () => {
  const [loading, setLoading] = useState(false);

  // Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [mobileNotifications, setMobileNotifications] = useState(false);

  const [trendSpike, setTrendSpike] = useState(30);
  const [mentionVelocity, setMentionVelocity] = useState(1000);

  // Alerts list
  const [recentAlerts, setRecentAlerts] = useState<AlertRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Status counts
  const activeCount = recentAlerts.filter((a) => a.priority === "high").length;
  const pendingCount = recentAlerts.filter((a) => a.priority === "medium").length;

  const fetchSettingsAndAlerts = async () => {
    setLoading(true);
    setError(null);

    // Fetch alerts from backend API
    const response = await apiClient.getAlerts();
    
    if (response.success && response.data) {
      const alerts = (response.data.alerts || []) as AlertRow[];
      setRecentAlerts(alerts);
    } else {
      console.error("Fetch alerts error:", response.error);
      setError(response.error || "Failed to fetch alerts");
    }

    setLoading(false);
  };

  const saveSettings = async () => {
    setLoading(true);
    
    // Settings are saved locally (academic demo - no backend persistence)
    // In a real app, this would POST to /api/alerts/settings
    const payload = {
      email_notifications: emailNotifications,
      browser_notifications: browserNotifications,
      mobile_notifications: mobileNotifications,
      trend_spike_threshold: trendSpike,
      mention_velocity_threshold: mentionVelocity,
    };

    // Save to localStorage for this session
    localStorage.setItem('alertSettings', JSON.stringify(payload));

    alert("Settings saved successfully ✅");
    setLoading(false);
  };

  useEffect(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('alertSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setEmailNotifications(settings.email_notifications ?? true);
        setBrowserNotifications(settings.browser_notifications ?? true);
        setMobileNotifications(settings.mobile_notifications ?? false);
        setTrendSpike(settings.trend_spike_threshold ?? 30);
        setMentionVelocity(settings.mention_velocity_threshold ?? 1000);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    
    fetchSettingsAndAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold dark:text-white">Manage Alerts</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Configure and manage your trend alerts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Settings */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Bell className="w-5 h-5" />
                  Alert Settings
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <h3 className="font-medium dark:text-white">
                      Notification Channels
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                        />
                        <span className="dark:text-gray-300">
                          Email notifications
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={browserNotifications}
                          onChange={(e) =>
                            setBrowserNotifications(e.target.checked)
                          }
                        />
                        <span className="dark:text-gray-300">
                          Browser notifications
                        </span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={mobileNotifications}
                          onChange={(e) => setMobileNotifications(e.target.checked)}
                        />
                        <span className="dark:text-gray-300">
                          Mobile push notifications
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Alert Thresholds */}
                  <div className="space-y-4">
                    <h3 className="font-medium dark:text-white">
                      Alert Thresholds
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm dark:text-gray-300">
                          Trend Spike (% increase):{" "}
                          <b className="dark:text-white">{trendSpike}%</b>
                        </label>

                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={trendSpike}
                          onChange={(e) => setTrendSpike(Number(e.target.value))}
                          className="w-full mt-2"
                        />

                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>10%</span>
                          <span>30%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm dark:text-gray-300">
                          Mention Velocity (daily):{" "}
                          <b className="dark:text-white">{mentionVelocity}</b>
                        </label>

                        <input
                          type="range"
                          min="100"
                          max="10000"
                          step="100"
                          value={mentionVelocity}
                          onChange={(e) =>
                            setMentionVelocity(Number(e.target.value))
                          }
                          className="w-full mt-2"
                        />

                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>100</span>
                          <span>1K</span>
                          <span>10K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" onClick={saveSettings}>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Status */}
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Alert Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="dark:text-gray-300">Active Alerts</span>
                    </div>
                    <span className="font-bold dark:text-white">
                      {activeCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span className="dark:text-gray-300">Pending</span>
                    </div>
                    <span className="font-bold dark:text-white">
                      {pendingCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Alerts</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.length === 0 ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No alerts yet.
                    </div>
                  ) : (
                    recentAlerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg ${
                          alert.priority === "high"
                            ? "bg-red-50 dark:bg-red-900/20"
                            : alert.priority === "medium"
                            ? "bg-yellow-50 dark:bg-yellow-900/20"
                            : "bg-green-50 dark:bg-green-900/20"
                        }`}
                      >
                        <div className="text-sm font-medium dark:text-white">
                          {alert.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                          {alert.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
