import React, { useEffect } from 'react';

const CustomModal = ({ title, isOpen, onClose, children }) => {
  useEffect(() => {
    // Close modal when Escape key is pressed
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose} // Close modal when clicking the background
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Prevents modal click from closing
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">{children}</div>
        {/* <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none">
            Confirm
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default CustomModal;
