import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../services/api';

function OAuthCallback() {
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('authenticating');
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const processedRef = useRef(false);
  
  useEffect(() => {
    // Only run this once
    if (processedRef.current) {
      return;
    }
    
    const handleCallback = async () => {
      try {        
        // Set the flag to prevent multiple executions
        processedRef.current = true;
        setLoadingStep('authenticating');
        
        // Extract authorization code from URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code found');
        }

        // Exchange code for JWT token
        const { data, error: apiError } = await authApi.callback(code);
        
        if (apiError) {
          throw new Error(apiError);
        }
        
        setLoadingStep('loading-profile');
        
        const { data: userdata, apiError: loginError } = await authApi.login(data.id_token);

        if (loginError) {
          throw new Error(apiError);
        }
        
        console.log('Logged in as:', userdata);

        // Save token and update auth state
        login(data.id_token, userdata.username, userdata.id);
        
        setLoadingStep('redirecting');
        
        // Redirect to home page after a short delay for better UX
        setTimeout(() => {
          navigate('/');
        }, 1000);
        
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message);
      }
    };
    
    handleCallback();
  }, [location.search]); // Reduce dependencies to just the search params
  
  // Loading messages based on step
  const loadingMessages = {
    'authenticating': 'Authenticating with Google...',
    'loading-profile': 'Loading your profile...',
    'redirecting': 'Taking you to your dashboard...'
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div className="flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Authentication Failed</h3>
            <p className="text-gray-600">{error}</p>
          </div>
          <div className="pt-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">IUTicket</h2>
        </div>
        
        <div className="space-y-6">
          {/* Loading spinner */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div className="h-16 w-16 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700">{loadingMessages[loadingStep]}</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ 
                width: loadingStep === 'authenticating' ? '33%' : 
                       loadingStep === 'loading-profile' ? '66%' : '100%' 
              }}
            ></div>
          </div>
          
          {/* Steps */}
          <div className="flex justify-between text-xs text-gray-500">
            <div className={loadingStep === 'authenticating' ? 'text-blue-600 font-medium' : 
                            loadingStep === 'loading-profile' || loadingStep === 'redirecting' ? 'text-green-600 font-medium' : ''}>
              Authentication
            </div>
            <div className={loadingStep === 'loading-profile' ? 'text-blue-600 font-medium' : 
                            loadingStep === 'redirecting' ? 'text-green-600 font-medium' : ''}>
              Profile
            </div>
            <div className={loadingStep === 'redirecting' ? 'text-blue-600 font-medium' : ''}>
              Dashboard
            </div>
          </div>
          
        </div>
      </div>
      
      <p className="mt-8 text-center text-gray-500 text-sm">
        © 2025 IUTicket. All rights reserved.
      </p>
    </div>
  );
}

export default OAuthCallback;