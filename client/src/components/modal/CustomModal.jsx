<<<<<<< HEAD
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal when clicking the background
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Prevents modal click from closing
      >
=======
import React from 'react';

const CustomModal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
<<<<<<< HEAD
            className="text-gray-600 hover:text-gray-900"
=======
            className="text-gray-600 hover:text-gray-100"
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
          >
            &times;
          </button>
        </div>
        <div className="mb-4">{children}</div>
<<<<<<< HEAD
        {/* <div className="flex justify-end">
=======
        <div className="flex justify-end">
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
          <button
            className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
<<<<<<< HEAD
          <button className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none">
            Confirm
          </button>
        </div> */}
=======
          <button
            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
            onClick={onClose}
          >
            Confirm
          </button>
        </div>
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
      </div>
    </div>
  );
};

export default CustomModal;
