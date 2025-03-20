import React from 'react';

function StatusBadge({ status }) {
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "BACKLOG":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      case "TODO":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "DONE":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <span className={`px-4 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClasses(status)}`}>
      {status}
    </span>
  );
}

export default StatusBadge;