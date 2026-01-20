import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, User, 
  ArrowRight, Check, AlertCircle,
  Sparkles, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter a password');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Store user data
      const userData = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=6366f1&color=fff`,
        joined: new Date().toISOString()
      };
      
      // Generate token
      const token = `trendlytix_token_${Date.now()}`;
      
      // Store in localStorage for demo
      localStorage.setItem('trendlytix_token', token);
      localStorage.setItem('trendlytix_user', JSON.stringify(userData));
      
      // Save credentials for convenience (optional)
      localStorage.setItem('trendlytix_saved_credentials', JSON.stringify({
        email: formData.email,
        // NOTE: Never store passwords in localStorage for security!
      }));
      
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Dispatch auth change event
      const authEvent = new CustomEvent('authChange', { 
        detail: { authenticated: true, user: userData } 
      });
      window.dispatchEvent(authEvent);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
      setIsLoading(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackToLogin = () => {
    navigate('/login');
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
          <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
          <p className="text-muted-foreground">
            Start exploring trends with AI-powered insights
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToLogin}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Sign Up Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <Check className="w-4 h-4" />
                    Passwords match
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 rounded border-input"
                    required
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    className="mt-1 rounded border-input"
                    defaultChecked
                  />
                  <Label 
                    htmlFor="newsletter" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Send me product updates, tips, and newsletters
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { icon: '📊', title: 'AI Insights', desc: 'Smart trend analysis' },
            { icon: '🚀', title: 'Real-time Data', desc: 'Live trend monitoring' },
            { icon: '🛡️', title: 'Secure', desc: 'Enterprise-grade security' },
            { icon: '💼', title: 'Professional', desc: 'Business-grade tools' },
          ].map((benefit, index) => (
            <div 
              key={index} 
              className="text-center p-3 rounded-lg bg-card border"
            >
              <div className="text-2xl mb-2">{benefit.icon}</div>
              <div className="font-medium text-sm">{benefit.title}</div>
              <div className="text-xs text-muted-foreground">{benefit.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignUp;