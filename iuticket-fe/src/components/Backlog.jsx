import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../services/api';
import { isOverdue, formatDate } from "../utils/formatters";
import StatusDropdown from './common/StatusDropdown';

function Backlog() {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!token) {
      console.warn("No token available");
      return;
    }
    
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
    
    fetchTickets();
  }, [token]);
  
  
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const ticketData = { status: newStatus };
      const { data, apiError } = await ticketApi.update(ticketId, ticketData, token);
      
      if (apiError) {
        throw new Error(`Failed to update ticket: ${apiError.status}`);
      }
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
    } catch (err) {
      console.error('Error updating ticket:', err);
      alert(`Failed to update ticket: ${err.message}`);
    }
  };
    
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'BACKLOG':
        return 'bg-gray-100 text-gray-800';
      case 'TODO':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  })
  // Sort tickets by status and then by due date
  .sort((a, b) => {
    // Priority order: TODO, IN_PROGRESS, BACKLOG, DONE
    const statusOrder = { 'TODO': 1, 'IN_PROGRESS': 2, 'BACKLOG': 3, 'DONE': 4 };
    const statusComparison = statusOrder[a.status] - statusOrder[b.status];
    
    // If same status, sort by due date (closest due date first)
    return statusComparison !== 0 ? statusComparison : new Date(a.dueDate) - new Date(b.dueDate);
  });

  const handleStatusChange = async (e, ticketId) => {
    const newStatus = e.target.value;
    await updateTicketStatus(ticketId, newStatus);
  };

  const navigateToTicket = (ticketId) => {
    navigate(`/ticket/${ticketId}?origin=backlog`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">        
        <main className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Task Management
              </h2>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Filter buttons */}
                <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                      filterStatus === 'ALL' 
                        ? 'bg-white border border-gray-300 shadow-sm text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilterStatus('BACKLOG')}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                      filterStatus === 'BACKLOG' 
                        ? 'bg-white border border-gray-300 shadow-sm text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Backlog
                  </button>
                  <button 
                    onClick={() => setFilterStatus('TODO')}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                      filterStatus === 'TODO' 
                        ? 'bg-white border border-gray-300 shadow-sm text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Todo
                  </button>
                  <button 
                    onClick={() => setFilterStatus('IN_PROGRESS')}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                      filterStatus === 'IN_PROGRESS' 
                        ? 'bg-white border border-gray-300 shadow-sm text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => setFilterStatus('DONE')}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                      filterStatus === 'DONE' 
                        ? 'bg-white border border-gray-300 shadow-sm text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Done
                  </button>
                </div>

              </div>
            </div>
          </div>
          
          {loading && (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="p-6 bg-red-50 text-red-700 border-l-4 border-red-500">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && filteredTickets.length === 0 && (
            <div className="p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-lg text-gray-500">No matching tickets found.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
          
          {!loading && !error && filteredTickets.length > 0 && (
  <div className="overflow-x-auto sm:overflow-visible">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" className="hidden sm:table-cell px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
          <th scope="col" className="hidden md:table-cell px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredTickets.map(ticket => (
          <tr key={ticket.id} className="hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => navigateToTicket(ticket.id)}>
            <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{ticket.id}</td>
            
            <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 font-medium">
              <div className="max-w-xs truncate">
                {ticket.title}
              </div>
              {/* Mobile-only date display */}
              <div className="sm:hidden text-xs text-gray-500 mt-1">
                {isOverdue(ticket.dueDate) ? (
                  <span className="text-red-600">Due: {formatDate(ticket.dueDate)}</span>
                ) : (
                  <span>Due: {formatDate(ticket.dueDate)}</span>
                )}
              </div>
            </td>
            
            <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <div onClick={(e) => e.stopPropagation()} className="">
                <StatusDropdown 
                  value={ticket.status} 
                  onChange={(e) => handleStatusChange(e, ticket.id)} 
                  disabled={false} 
                />
              </div>
            </td>
            
            <td className="hidden sm:table-cell px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
              <span className={`${isOverdue(ticket.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                {formatDate(ticket.dueDate)}
                {isOverdue(ticket.dueDate) && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </span>
            </td>
            
            <td className="hidden md:table-cell px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(ticket.createdAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Backlog;