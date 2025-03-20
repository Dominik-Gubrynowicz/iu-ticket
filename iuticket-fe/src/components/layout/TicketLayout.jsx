// src/components/ticket/TicketLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

function TicketLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </div>
    </div>
  );
}

export default TicketLayout;