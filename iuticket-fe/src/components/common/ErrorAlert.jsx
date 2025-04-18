import React from 'react';

function ErrorAlert({ title, message }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 bg-red-50 text-red-700 border-l-4 border-red-500">
      <div className="flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <p className="font-medium">{title || 'Error'}</p>
          <p className="mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default ErrorAlert;