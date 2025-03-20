import React from 'react';

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="bg-white shadow rounded-lg p-12 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-opacity-50 border-t-blue-500"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}

export default LoadingSpinner;