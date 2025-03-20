import React from 'react';
import { formatDate, isDueSoon, isOverdue, getDaysLeft } from "../utils/formatters";

function KanbanColumn({ title, tickets, onDrop, badgeColor, navigate, isOverLimit }) {
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    onDrop(ticketId);
  };
  
  // Get appropriate CSS classes for due date indicator
  const getDueDateClasses = (dueDate) => {
    if (!dueDate) return '';

    if (isOverdue(dueDate)) return 'text-red-600';
    if (isDueSoon(dueDate)) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm transition-all ${
        isOverLimit ? 'shadow-amber-200' : ''
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`p-3 border-b border-gray-50 relative ${isOverLimit ? 'bg-amber-50/30' : ''}`}>
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-gray-700">{title}</h2>
          <div className="flex items-center gap-1.5">
            {isOverLimit && (
              <div className="text-xs text-amber-600 font-medium flex items-center opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-0.5">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Limit
              </div>
            )}
            <span className={`${
              isOverLimit 
                ? 'bg-amber-100 text-amber-800' 
                : badgeColor
            } text-xs font-medium px-2 py-0.5 rounded-full transition-colors`}>
              {tickets.length}
            </span>
          </div>
        </div>
        
        {isOverLimit && (
          <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-amber-300/50"></div>
        )}
      </div>
      
      {/* Tickets Container with Scroll */}
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {tickets.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-gray-400 text-sm">
              No tickets in {title.toLowerCase()}
            </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('ticketId', ticket.id)}
              onClick={() => navigate(`/ticket/${ticket.id}?origin=kanban`)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                  #{ticket.id}
                </span>
                {ticket.priority && (
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${ticket.priority === 'HIGH' ? 'bg-red-50 text-red-800' : 
                      ticket.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-800' : 
                      'bg-green-50 text-green-800'}`}
                  >
                    {ticket.priority === 'HIGH' ? 'H' : 
                      ticket.priority === 'MEDIUM' ? 'M' : 'L'}
                  </div>
                )}
              </div>
              
              <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{ticket.title}</h4>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                {formatDate(ticket.dueDate) ? (
                  <span className={`flex items-center ${getDueDateClasses(ticket.dueDate)}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(ticket.dueDate)}
                    {getDaysLeft(ticket.dueDate) !== null && (
                      <span className="ml-1">
                        ({getDaysLeft(ticket.dueDate) === 0 ? 'Today' : 
                          getDaysLeft(ticket.dueDate) < 0 ? `${Math.abs(getDaysLeft(ticket.dueDate))}d late` : 
                          `${getDaysLeft(ticket.dueDate)}d left`})
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">No due date</span>
                )}
                
                {ticket.assignee && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 uppercase">
                      {ticket.assignee.substring(0, 1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;