import { User, ChevronDown, BarChart3, Home, LogIn, LogOut, Search, GitCompare, Bell, FileText, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [showTools, setShowTools] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication on mount and when location changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('trendlytix_token');
      const userData = localStorage.getItem('trendlytix_user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for auth changes
    const handleAuthChange = () => checkAuth();
    const handleStorageChange = () => checkAuth();
    
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('trendlytix_token');
    localStorage.removeItem('trendlytix_user');
    setIsAuthenticated(false);
    setUser(null);
    
    // Dispatch auth change event
    const authEvent = new CustomEvent('authChange', { 
      detail: { authenticated: false } 
    });
    window.dispatchEvent(authEvent);
    
    navigate('/login');
    setShowProfile(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const tools = [
    { 
      icon: Search, 
      title: 'Analyze a Trend', 
      desc: 'Deep analysis of any trend', 
      color: 'text-blue-500',
      path: '/trend/1',
      requiresLogin: true
    },
    { 
      icon: GitCompare, 
      title: 'Compare Trends', 
      desc: 'Side-by-side trend comparison', 
      color: 'text-green-500',
      path: '/compare',
      requiresLogin: true
    },
    { 
      icon: Bell, 
      title: 'Manage Alerts', 
      desc: 'Configure trend alerts', 
      color: 'text-yellow-500',
      path: '/alerts',
      requiresLogin: true
    },
    { 
      icon: FileText, 
      title: 'Generate Report', 
      desc: 'Create detailed trend reports', 
      color: 'text-purple-500',
      path: '/report',
      requiresLogin: true
    }
  ];

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border bg-card/90 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary dark:shadow-glow">
              <BarChart3 size={22} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground dark:text-white">
              Trend<span className="bg-gradient-primary bg-clip-text text-transparent">Lytix</span>
            </h2>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className="gap-2 rounded-lg"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          {/* Tools Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 rounded-lg"
              onClick={() => setShowTools(!showTools)}
            >
              Tools <ChevronDown size={16} />
            </Button>
            
            {showTools && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-border dark:border-gray-700 shadow-2xl bg-card dark:bg-gray-800 p-2 z-50">
                {tools.map((tool, i) => {
                  const Icon = tool.icon;
                  const requiresLogin = tool.requiresLogin && !isAuthenticated;
                  
                  return (
                    <div key={i} className="relative">
                      <Link
                        to={requiresLogin ? '/login' : tool.path}
                        onClick={() => setShowTools(false)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition block no-underline ${
                          requiresLogin 
                            ? 'opacity-80 cursor-not-allowed' 
                            : 'hover:bg-muted dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={20} className={`${tool.color} mt-0.5 flex-shrink-0`} />
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm text-foreground dark:text-white">{tool.title}</div>
                          <div className="text-xs mt-0.5 text-muted-foreground dark:text-gray-300">{tool.desc}</div>
                        </div>
                        {requiresLogin && (
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Login</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <User size={18} className="text-foreground dark:text-white" />
                </Button>
                
                {showProfile && (
                  <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border dark:border-gray-700 shadow-xl bg-card dark:bg-gray-800 p-2 z-50">
                    <div className="p-3 border-b border-border dark:border-gray-700 mb-1">
                      <div className="font-semibold text-sm text-foreground dark:text-white">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-gray-300">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground dark:text-gray-300 hover:bg-muted dark:hover:bg-gray-700 transition">
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 text-sm transition mt-1 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
              <Button 
                size="sm" 
                className="gap-2"
                onClick={handleLogin}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border dark:border-gray-700">
        <div className="flex justify-around py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-lg transition ${
                  active 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Mobile Tools Button */}
          <button
            onClick={() => setShowTools(!showTools)}
            className={`flex flex-col items-center p-2 rounded-lg transition ${
              showTools
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white'
            }`}
          >
            <ChevronDown size={20} />
            <span className="text-xs mt-1">Tools</span>
          </button>
        </div>
        
        {/* Mobile Tools Dropdown */}
        {showTools && (
          <div className="px-4 pb-3">
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border border-border dark:border-gray-700 bg-card dark:bg-gray-800">
              {tools.map((tool, i) => {
                const Icon = tool.icon;
                const requiresLogin = tool.requiresLogin && !isAuthenticated;
                
                return (
                  <Link
                    key={i}
                    to={requiresLogin ? '/login' : tool.path}
                    onClick={() => setShowTools(false)}
                    className={`flex flex-col items-center p-3 rounded-lg transition relative ${
                      requiresLogin 
                        ? 'opacity-80' 
                        : 'hover:bg-muted dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} className={tool.color} />
                    <span className="text-xs mt-2 text-center text-foreground dark:text-white">{tool.title}</span>
                    {requiresLogin && (
                      <div className="absolute top-1 right-1">
                        <Lock className="w-3 h-3 text-yellow-500" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;