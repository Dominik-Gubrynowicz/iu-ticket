import React, { useState, useRef, useEffect } from 'react';

const statusOptions = [
  { value: 'BACKLOG', label: 'Backlog', color: 'bg-gray-200 text-gray-800', iconColor: 'bg-gray-400' },
  { value: 'TODO', label: 'To Do', color: 'bg-blue-100 text-blue-800', iconColor: 'bg-blue-500' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', iconColor: 'bg-yellow-500' },
  { value: 'DONE', label: 'Done', color: 'bg-green-100 text-green-800', iconColor: 'bg-green-500' }
];

function StatusDropdown({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentOption = statusOptions.find(option => option.value === value) || statusOptions[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        className={`w-full ${currentOption.color} border border-transparent rounded-md px-3 py-2 text-sm font-medium text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:opacity-90`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${currentOption.iconColor}`}></span>
          {currentOption.label}
          <svg className="ml-auto h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="fixed z-50 mt-2 w-60 bg-white shadow-xl rounded-md overflow-hidden border border-gray-100 animate-fade-in" 
             style={{
               left: dropdownRef.current?.getBoundingClientRect().left,
               top: dropdownRef.current?.getBoundingClientRect().bottom + window.scrollY,
             }}>
          <div className="py-1">
            {statusOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-3 flex items-center hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                  option.value === value ? 'bg-gray-50' : ''
                }`}
                onClick={() => {
                  onChange({ target: { name: 'status', value: option.value }});
                  setIsOpen(false);
                }}
              >
                <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-3 ${option.iconColor}`}></div>
                <span className="flex-grow font-medium">{option.label}</span>
                {option.value === value && (
                  <svg className="ml-auto h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;