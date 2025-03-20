import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ticketApi } from '../../services/api';
import TicketForm from '../common/TicketForm';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';

function TicketCreate() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialTicket = {
    title: '',
    description: '',
    status: 'BACKLOG',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default due date: 1 week from now
  };
  
  const [newTicket, setNewTicket] = useState(initialTicket);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({
      ...newTicket,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newTicket.title) {
      setError('Please fill out all required fields (Title)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: apiError } = await ticketApi.create(newTicket, token);
      
      if (apiError) {
        throw new Error(apiError);
      }

      // Navigate to the new ticket's page
      navigate(`/ticket/${data.id}`);
      
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Creating ticket..." />;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorAlert title="Error creating ticket" message={error} />
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Ticket
            </h2>
          </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow overflow-hidden">
            <TicketForm 
              ticket={newTicket}
              onChange={handleChange}
              loading={loading}
            />

            {/* Action buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Ticket'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketCreate;