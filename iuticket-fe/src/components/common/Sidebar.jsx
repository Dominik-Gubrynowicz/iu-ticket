import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, onClose, onLogout, username }) {
  const location = useLocation();
  
  // Helper function to determine if a route is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`bg-gray-800 text-white fixed inset-y-0 left-0 z-200 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Close button - mobile only */}
        <div className="pl-4 flex items-left justify-between lg:justify-left mb-6">
          <h1 className="text-xl font-bold">IU Ticket</h1>
          <button 
            onClick={onClose}
            className="text-white p-1 rounded-md hover:bg-gray-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-2">
          {/* Backlog */}
          <NavLink 
            to="/backlog" 
            onClick={onClose} // Close sidebar on mobile when link is clicked
            className={`flex items-center p-3 rounded-md transition-colors ${
              isActive('/backlog') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Backlog
          </NavLink>
          
          {/* Kanban Board */}
          <NavLink 
            to="/kanban" 
            onClick={onClose}
            className={`flex items-center p-3 rounded-md transition-colors ${
              isActive('/kanban') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Kanban Board
          </NavLink>
          
          {/* Create New Ticket */}
          <NavLink 
            to="/ticket/new" 
            onClick={onClose}
            className={`flex items-center p-3 rounded-md transition-colors ${
              isActive('/ticket/new') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Ticket
          </NavLink>
        </nav>
        
        {/* Push logout button to bottom */}
        <div className="mt-auto">
            <div className="flex items-center p-3 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
              <svg xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">{username}</span>
            </div>
          <button 
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex w-full items-center p-3 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;