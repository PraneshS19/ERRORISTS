import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, 
  ArrowRight, Sparkles,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface LoginProps {
  onLogin: (token: string, userData: any) => void;
  onPageAccess?: () => void;
}

const Login = ({ onLogin, onPageAccess }: LoginProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Load saved credentials if "remember me" was checked
  useEffect(() => {
    const savedCredentials = localStorage.getItem('trendlytix_saved_credentials');
    if (savedCredentials) {
      try {
        const creds = JSON.parse(savedCredentials);
        setFormData(prev => ({
          ...prev,
          email: creds.email || '',
          rememberMe: true
        }));
      } catch (e) {
        console.error('Failed to load saved credentials:', e);
      }
    }

    if (onPageAccess) {
      onPageAccess();
    }
  }, [onPageAccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Please enter your password');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create user data
      const userData = {
        id: '1',
        name: formData.email.split('@')[0],
        email: formData.email,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.email.split('@')[0])}&background=6366f1&color=fff`
      };
      
      // Generate token
      const token = `trendlytix_token_${Date.now()}`;
      
      // Store user data and token
      localStorage.setItem('trendlytix_token', token);
      localStorage.setItem('trendlytix_user', JSON.stringify(userData));
      
      // Store credentials if "remember me" is checked
      if (formData.rememberMe) {
        localStorage.setItem('trendlytix_saved_credentials', JSON.stringify({
          email: formData.email,
          // NOTE: Never store passwords in localStorage for security!
        }));
      } else {
        localStorage.removeItem('trendlytix_saved_credentials');
      }
      
      // Call parent login handler
      onLogin(token, userData);
      
      // Dispatch auth change event for other components
      const authEvent = new CustomEvent('authChange', { 
        detail: { authenticated: true, user: userData } 
      });
      window.dispatchEvent(authEvent);
      
      // Redirect to dashboard
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">TrendLytix</h1>
              <p className="text-muted-foreground">AI Trend Analytics</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">
            Sign in to access your trend dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me for 30 days
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                  onClick={handleSignUpRedirect}
                >
                  Create account
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;