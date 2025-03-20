// Format date in a more readable way
export const formatDate = (dateString) => {
  if (!dateString) return undefined;

  const date = new Date(dateString);

  if (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1) {
    return 'No due date';
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
  
// Format date for input fields
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Format: YYYY-MM-DDTHH:MM
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getStatusBadgeClasses = (status) => {
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

export const isOverdue = (dateString) => {
  const date = new Date(dateString);
  if (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1) {
    return false;
  }

  const dueDate = new Date(dateString);
  const today = new Date();
  return dueDate < today;
};

export const isDueSoon = (dateString) => {
  if (!dateString) return false;

  const dueDate = new Date(dateString);
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  return dueDate > today && dueDate <= threeDaysFromNow;
};

export const getDueDateBadgeClasses = (dateString) => {
  if (isOverdue(dateString)) {
    return "bg-red-50 text-red-700 border-red-300";
  } else if (isDueSoon(dateString)) {
    return "bg-amber-50 text-amber-700 border-amber-300";
  }
  return "bg-purple-50 text-purple-700 border-purple-300";
};

export const getDueDateIcon = (dateString) => {
  // Your existing icon components
};

export const getDueDateMessage = (dateString) => {
  if (isOverdue(dateString)) {
    return "OVERDUE: ";
  } else if (isDueSoon(dateString)) {
    return "DUE SOON: ";
  }
  return "Due: ";
};

export const getDaysLeft = (dueDate) => {
  if (!dueDate) return null;
  
  // Check if date is 1970-01-01 (epoch start)
  const date = new Date(dueDate);
  if (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1) {
    return null;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};