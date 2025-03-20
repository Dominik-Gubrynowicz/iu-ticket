import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import KanbanColumn from './KanbanColumn';
import { ticketApi, userApi } from '../services/api';

function Kanban() {
  const { token, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWipSettings, setShowWipSettings] = useState(false);
  const [wipLimits, setWipLimits] = useState({
    todoLimit: 5,
    inProgressLimit: 3
  });
  
  useEffect(() => {   
    setLoading(true); 
    fetchTickets();
    fetchWipLimits();
    setLoading(false);
  }, []);
  
  const fetchWipLimits = async () => {
    try {
      const { data, apiError } = await userApi.get(userId, token);
      
      if (apiError) {
        console.error('Error fetching WIP limits:', apiError);
        return;
      }
      
      setWipLimits({
        todoLimit: data.userConfig.todoWipLimit,
        inProgressLimit: data.userConfig.inProgressWipLimit
      })
    } catch (err) {
      console.error('Error fetching WIP limits:', err);
    }
  };
  
  const updateWipLimits = async (newWipLimits) => {
    try {
      setShowWipSettings(true);
      
      const updatedUserData = {
        userConfig: {
            todoWipLimit: newWipLimits.todoLimit,
            inProgressWipLimit: newWipLimits.inProgressLimit
        }
      };
      
      const { apiError } = await userApi.update(userId, updatedUserData, token);
      
      if (apiError) {
        throw new Error(`Failed to update WIP limits: ${apiError}`);
      }
      
      setWipLimits(newWipLimits);
      setShowWipSettings(false);
    } catch (err) {
      console.error('Error updating WIP limits:', err);
      alert(`Failed to update WIP limits: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, apiError } = await ticketApi.getAll(token);
      
      if (apiError) {
        throw new Error(`Failed to fetch tickets: ${apiError.status}`);
      }
      
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const ticket = tickets.find(t => t.id === parseInt(ticketId));
      if (!ticket || ticket.status === newStatus) return;

      const { data, apiError } = await ticketApi.update(ticketId, { status: newStatus }, token);
      
      if (apiError) {
        throw new Error(`Failed to update ticket: ${apiError.status}`);
      }
      
      // Update the ticket in our local state
      setTickets(prevTickets => 
        prevTickets.map(t => 
          t.id === parseInt(ticketId) ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error('Error updating ticket:', err);
      alert(`Failed to update ticket status: ${err.message}`);
    }
  };

  // Filter tickets by status and search term
  const filteredTickets = tickets.filter(ticket => 
    searchTerm === '' || 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toString().includes(searchTerm)
  );
  
  const todoTickets = filteredTickets.filter(ticket => ticket.status === 'TODO');
  const inProgressTickets = filteredTickets.filter(ticket => ticket.status === 'IN_PROGRESS');
  const doneTickets = filteredTickets.filter(ticket => ticket.status === 'DONE' && new Date(ticket.updatedAt) > new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
  
  const isTodoOverLimit = todoTickets.length > wipLimits.todoLimit;
  const isInProgressOverLimit = inProgressTickets.length > wipLimits.inProgressLimit;
  
  return (
    <div className="p-6">      
      {/* Search and Actions Bar */}
      <div className="bg-white shadow rounded-lg mb-4 p-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-1.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/ticket/new')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Ticket
            </button>
            <button
              onClick={() => setShowWipSettings(true)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md flex items-center transition-colors text-sm"
              title="WIP Limits"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              WIP Limits
            </button>
            <button
              onClick={fetchTickets}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Refresh tickets"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading, Error, and Empty states remain unchanged... */}
      
      {/* Kanban Board */}
      {!loading && !error && filteredTickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KanbanColumn 
            title={`TODO (${todoTickets.length}/${wipLimits.todoLimit})`} 
            tickets={todoTickets} 
            onDrop={(ticketId) => updateTicketStatus(ticketId, 'TODO')} 
            badgeColor="bg-blue-100 text-blue-800"
            navigate={navigate}
            isOverLimit={isTodoOverLimit}
          />
          <KanbanColumn 
            title={`IN PROGRESS (${inProgressTickets.length}/${wipLimits.inProgressLimit})`} 
            tickets={inProgressTickets} 
            onDrop={(ticketId) => updateTicketStatus(ticketId, 'IN_PROGRESS')} 
            badgeColor="bg-yellow-100 text-yellow-800"
            navigate={navigate}
            isOverLimit={isInProgressOverLimit}
          />
          <KanbanColumn 
            title="DONE" 
            tickets={doneTickets} 
            onDrop={(ticketId) => updateTicketStatus(ticketId, 'DONE')} 
            badgeColor="bg-green-100 text-green-800"
            navigate={navigate}
          />
        </div>
      )}
      
      {/* WIP Limits Settings Modal */}
      {showWipSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Work-In-Progress Limits</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="todoLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Todo Column Limit
                </label>
                <input
                  type="number"
                  id="todoLimit"
                  min="1"
                  value={wipLimits.todoLimit}
                  onChange={(e) => setWipLimits(prev => ({ ...prev, todoLimit: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="inProgressLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  In Progress Column Limit
                </label>
                <input
                  type="number"
                  id="inProgressLimit"
                  min="1"
                  value={wipLimits.inProgressLimit}
                  onChange={(e) => setWipLimits(prev => ({ ...prev, inProgressLimit: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>WIP limits help maintain focus and prevent overloading your workflow.</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowWipSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => updateWipLimits(wipLimits)}
                disabled={loading}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kanban;