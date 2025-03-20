import React from 'react';
import { formatDate, formatDateForInput, getStatusBadgeClasses, getDueDateBadgeClasses, getDueDateIcon, getDueDateMessage } from '../../utils/formatters';

function TicketDetails({ ticket }) {
  return (
    <>
      {/* Ticket header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
            {ticket.title}
          </h2>
          <span
            className={`px-4 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClasses(
              ticket.status
            )}`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-5 border-b border-gray-200 pb-3">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Description
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700 pb-4 rounded-md">
          {ticket.description || (
            <span className="text-gray-400 italic">
              No description provided
            </span>
          )}
        </div>
      </div>

      {/* Metadata badges */}
      <div className="px-6 py-6">
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium inline-flex items-center border border-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Created: {formatDate(ticket.createdAt)}
          </div>
          {ticket.updatedAt && (
            <div className="px-3 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium inline-flex items-center border border-orange-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Updated: {formatDate(ticket.updatedAt)}
            </div>
          )}
          
          {!!ticket.dueDate && (
            <div className={`px-3 py-1 rounded-md text-xs font-medium inline-flex items-center border ${getDueDateBadgeClasses(ticket.dueDate)}`}>
            {getDueDateIcon(ticket.dueDate)}
            <span>
              {getDueDateMessage(ticket.dueDate)}
              {formatDate(ticket.dueDate)}
            </span>
          </div>)}
        </div>
      </div>
    </>
  );
}

export default TicketDetails;