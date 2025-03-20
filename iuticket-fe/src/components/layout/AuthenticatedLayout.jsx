import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import { authApi } from "../../services/api";

function AuthenticatedLayout({ children }) {
  const { token, logout, username } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const validateToken = async () => {
      const { data, apiError } = await authApi.validateToken(token);
      if (apiError) {
        logout();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    validateToken();

  }, [logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Top navigation bar - only visible on mobile */}
      <header className="lg:hidden bg-gray-800 text-white shadow-sm z-30 fixed top-0 left-0 right-0">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* App logo/name */}
            <Link to="/" className="flex items-center ml-2">
              <span className="ml-2 font-semibold text-xl">IUTicket</span>
            </Link>
          </div>

        </div>
      </header>
      
      {/* Sidebar with mobile responsiveness */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} onLogout={handleLogout} username={username} />
      
      {/* Overlay to close sidebar when clicked (mobile only) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-150 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Main content area - adjust for sidebar width and top bar height on mobile */}
      <div className="w-full lg:pl-64 transition-all duration-300 ease-in-out pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}

export default AuthenticatedLayout;