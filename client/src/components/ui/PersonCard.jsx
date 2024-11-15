import React from 'react';
import { FaEdit, FaTrash, FaMoneyBillWave } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { IoPerson } from 'react-icons/io5';
import getInitials from '../../helpers/getInitials';

const PersonCard = ({
  name,
  addedOn,
  amountOwed,
  contact,
  onEdit,
  onDelete,
}) => {
  const isSettled = amountOwed === 0;

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-6 space-y-4 w-full border-l-4 border-lime-500 hover:shadow-lg transition-shadow duration-200 ease-in-out">
      {/* Header with name and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 mt-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-300 text-gray-800 font-semibold text-2xl border-2 border-white shadow-sm">
            {getInitials(name)}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
        <GoDotFill
          className={`text-${isSettled ? 'green' : 'red'}-500`}
          title={isSettled ? 'Settled' : 'Unsettled'}
        />
      </div>
      <div>
        <p className="text-gray-600">Added on {addedOn}</p>
        <p className="text-gray-600">Email: {contact.email}</p>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 mt-4">
        <button
          onClick={onEdit}
          className="flex items-center space-x-1 bg-lime-200 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Edit"
        >
          <FaEdit />
          <span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center space-x-1 bg-gray-100 text-red-500 hover:text-red-700 focus:outline-none"
          aria-label="Delete"
        >
          <FaTrash />
        </button>
        {/* <button
          className="flex items-center space-x-1 text-lime-600 hover:text-lime-700 focus:outline-none"
          aria-label="Settle Payment"
        >
          <FaMoneyBillWave />
          <span>Settle</span>
        </button> */}
      </div>
    </div>
  );
};

export default PersonCard;
