import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 dark:text-white">404</h1>
          <h2 className="text-xl font-semibold mb-3 dark:text-gray-300">Page Not Found</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The page <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{location.pathname}</code> could not be found.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
            
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;