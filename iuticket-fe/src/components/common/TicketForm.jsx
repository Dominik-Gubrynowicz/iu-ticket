import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/DatePickerStyles.css";
import StatusDropdown from "./StatusDropdown";

function TicketForm({ ticket, onChange, loading }) {
  const dateInputRef = useRef(null);

  // Convert string date to Date object for DatePicker
  const dueDate = ticket.dueDate ? new Date(ticket.dueDate) : null;

  // Handle date change from the DatePicker
  const handleDateChange = (date) => {
    // Set time to end of day for due dates (23:59:59)
    if (date) {
      date.setHours(23, 59, 59, 999);
    }

    onChange({
      target: {
        name: "dueDate",
        value: date ? date.toISOString() : null,
      },
    });
  };

  // Handle removing the due date
  const handleRemoveDueDate = () => {
    onChange({
      target: {
        name: "dueDate",
        value: null,
      },
    });
  };

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 gap-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={ticket.title || ""}
            onChange={onChange}
            disabled={loading}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter ticket title"
            required
          />
        </div>
        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={ticket.description || ""}
            onChange={onChange}
            disabled={loading}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter ticket description (optional)"
          />
          <p className="mt-1 text-xs text-gray-500">
            A detailed description helps others understand the ticket better.
          </p>
        </div>
        {/* Status Field */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <StatusDropdown
            value={ticket.status || "TODO"}
            onChange={onChange}
            disabled={loading}
          />
        </div>

        {/* Due Date Field with enhanced DatePicker */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <div className="relative">
            <div className="relative" ref={dateInputRef}>
              <DatePicker
                selected={dueDate}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a due date"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2 pl-10"
                disabled={loading}
                required={false}
                isClearable={false}
                popperClassName="react-datepicker-popper"
                popperPlacement="bottom-start"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            {dueDate && (
              <button
                type="button"
                onClick={handleRemoveDueDate}
                disabled={loading}
                className={`absolute right-2 top-2 text-gray-400 hover:text-gray-600 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                title="Clear due date"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            When do you want this ticket to be completed? (optional)
          </p>
        </div>
      </div>
    </div>
  );
}

export default TicketForm;
