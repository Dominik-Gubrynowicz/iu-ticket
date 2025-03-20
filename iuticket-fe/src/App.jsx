import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';
import Login from './components/Login';
import Backlog from './components/Backlog';
import Kanban from './components/Kanban';
import { AuthProvider } from './context/AuthContext';
import TicketEdit from './components/ticket/TicketEdit';
import TicketCreate from './components/ticket/TicketCreate';
import TicketView from './components/ticket/TicketView';
import OAuthCallback from './components/OAuthCallback';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/oauth2/code/google" element={<OAuthCallback />} />

          {/* Protected routes using AuthenticatedLayout */}
          <Route 
            path="/backlog" 
            element={
              <AuthenticatedLayout>
                <Backlog />
              </AuthenticatedLayout>
            } 
          />
          
          <Route 
            path="/kanban" 
            element={
              <AuthenticatedLayout>
                <Kanban />
              </AuthenticatedLayout>
            } 
          />
          
          <Route 
            path="/ticket/:id" 
            element={
              <AuthenticatedLayout>
                <TicketView />
              </AuthenticatedLayout>
            } 
          />
          
          <Route 
            path="/ticket/new" 
            element={
              <AuthenticatedLayout>
                <TicketCreate />
              </AuthenticatedLayout>
            } 
          />
          
          <Route 
            path="/ticket/:id/edit" 
            element={
              <AuthenticatedLayout>
                <TicketEdit />
              </AuthenticatedLayout>
            } 
          />
          
          {/* Redirect root to backlog */}
          <Route path="/" element={<Navigate to="/backlog" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;