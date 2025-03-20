import React from 'react';
import { isOverdue, isDueSoon, formatDate } from '../../utils/formatters';

function TicketStatusBanner({ ticket }) {
  if (!ticket) return null;
  
  return (
    <>
      {isOverdue(ticket.dueDate) && ticket.status !== 'DONE' && (
        <div className="px-6 py-3 bg-red-50">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-700 font-medium">This ticket is overdue! It was due {formatDate(ticket.dueDate)}.</span>
          </div>
        </div>
      )}
      
      {isDueSoon(ticket.dueDate) && ticket.status !== 'DONE' && (
        <div className="px-6 py-3 bg-amber-50">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-amber-700 font-medium">This ticket is due soon! Due date is {formatDate(ticket.dueDate)}.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default TicketStatusBanner;