import React, { useEffect } from 'react';

const CustomModal = ({ title, isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('overflow-hidden'); // Prevent scrolling
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      onClick={onClose} // Close modal when clicking the background
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-60"
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
        <div className="modal-content max-h-96 overflow-y-auto mb-4">
          {/* Content that can scroll */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
