import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TrendDetail from "./pages/TrendDetail";
import Compare from "./pages/Compare";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('trendlytix_token');
      const user = localStorage.getItem('trendlytix_user');
      
      if (token && user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
    
    // Listen for auth changes from other components
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('trendlytix_token', token);
    localStorage.setItem('trendlytix_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    
    // Dispatch event for other components
    const authEvent = new CustomEvent('authChange', { 
      detail: { authenticated: true } 
    });
    window.dispatchEvent(authEvent);
  };

  // Clear auth state when user manually navigates to login
  const handleLoginPageAccess = () => {
    if (isAuthenticated) {
      // If user is already authenticated but manually goes to /login
      // Clear auth and let them login fresh
      localStorage.removeItem('trendlytix_token');
      localStorage.removeItem('trendlytix_user');
      setIsAuthenticated(false);
      const authEvent = new CustomEvent('authChange', { 
        detail: { authenticated: false } 
      });
      window.dispatchEvent(authEvent);
    }
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes - No login required */}
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Login route - Always accessible */}
              <Route path="/login" element={
                <Login onLogin={handleLogin} onPageAccess={handleLoginPageAccess} />
              } />
              
              {/* Signup route - Always accessible */}
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected routes - Login required */}
              <Route path="/trend/:id" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                  <TrendDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/compare" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                  <Compare />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                  <Analytics />
                </ProtectedRoute>
              } />

              {/* Tools routes - Login required */}
              <Route path="/alerts" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                  <Alerts />
                </ProtectedRoute>
              } />
              
              <Route path="/report" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                  <Report />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;