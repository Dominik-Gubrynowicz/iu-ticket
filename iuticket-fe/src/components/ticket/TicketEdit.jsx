// src/components/ticket/TicketEdit.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ticketApi } from '../../services/api';
import TicketForm from '../common/TicketForm';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

function TicketEdit() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [editedTicket, setEditedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch ticket data using the centralized API service
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        
        const { data, error: apiError } = await ticketApi.getById(id, token);
        
        if (apiError) {
          throw new Error(apiError);
        }
        
        if (data.dueDate === "1970-01-01T00:00:00.000+00:00") {
          data.dueDate = undefined;
        }

        setTicket(data);
        setEditedTicket(data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(err.message || "Failed to load ticket. Please try again.");
        
        // If we got a 404, the ticket doesn't exist
        if (err.status === 404) {
          setError("This ticket doesn't exist or you don't have permission to edit it.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchTicket();
    } else {
      setLoading(false);
      setError("Authentication required");
    }
  }, [id, token, navigate]);

  // Handle edit changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTicket({
      ...editedTicket,
      [name]: value,
    });
  };

  // Handle ticket update
  const handleUpdateTicket = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      
      console.log('editedTicket:', editedTicket);

      const { data, error: apiError } = await ticketApi.update(id, editedTicket, token);
      
      if (apiError) {
        throw new Error(apiError);
      }
      
      // Update was successful - navigate back to ticket view
      navigate(`/ticket/${id}`);
    } catch (err) {
      console.error("Error updating ticket:", err);
      setUpdateError(err.message || "Failed to update ticket. Please try again.");
      
      // If we got a 404 or 403, handle accordingly
      if (err.status === 404 || err.status === 403) {
        setUpdateError("Unable to update ticket. This ticket may not exist or you don't have permission to edit it.");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading ticket details..." />;
  }

  if (error) {
    return <ErrorAlert title="Error loading ticket" message={error} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {editedTicket && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Ticket
            </h2>
          </div>
          
          {updateError && (
            <div className="mx-6 mb-4">
              <ErrorAlert title="Failed to update ticket" message={updateError} />
            </div>
          )}
          
          <TicketForm
            ticket={editedTicket}
            onChange={handleEditChange}
            loading={updateLoading}
          />

          {/* Action buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => navigate(`/ticket/${id}`)}
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${updateLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleUpdateTicket}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketEdit;