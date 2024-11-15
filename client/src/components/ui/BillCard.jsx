import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const colors = ['#4CAF50', '#FF9800', '#2196F3', '#FF5722', '#9C27B0'];

// Helper function to get initials from the first and last name
const getInitials = (name) => {
  const nameParts = name.split(' ');
  const firstInitial = nameParts[0]?.[0] || '';
  const lastInitial =
    nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const BillCard = ({
  name = 'T&T shopping',
  category = 'Groceries',
  date = 'August 28, 2022',
  totalAmount = 1000,
  remainingAmount = 0,
  members = [],
  onEdit,
  onDelete,
}) => {
  const totalContribution = members.reduce(
    (sum, member) => sum + member.amountOwed,
    0
  );

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-6 w-full border-l-4 border-lime-500 hover:shadow-lg transition-shadow duration-200 ease-in-out">
      {/* Header with store name and category */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
          <span
            role="img"
            aria-label="icon"
          >
            💖
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">{category}</p>
        </div>
      </div>

      {/* Split date */}
      <p className="text-sm text-gray-500 mt-2">Bill Split on {date}</p>

      {/* User Initials Avatars */}
      <div className="flex items-center space-x-2 mt-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-800 font-semibold text-base border-2 border-white shadow-sm"
          >
            {getInitials(member.name)}
          </div>
        ))}
      </div>

      {/* Total and Remaining amount */}
      <div className="mt-4">
        <p className="text-2xl font-bold text-green-500">
          Total: ${totalAmount}
        </p>
        <p className="text-lg text-yellow-500">Remaining: ${remainingAmount}</p>
      </div>

      {/* Contribution Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-4 rounded-full bg-gray-200 flex overflow-hidden">
          {members.map((member, index) => {
            const percentage = (member.amountOwed / totalContribution) * 100;
            const color = colors[index % colors.length];

            return (
              <div
                key={member.name}
                title={`${member.name}: $${member.amountOwed}`}
                className="h-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Member Contribution Details */}
      <div className="mt-2 flex flex-col space-y-1 text-sm text-gray-700">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <span className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span>{member.name}</span>
            </span>
            <span>${member.amountOwed}</span>
          </div>
        ))}
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
          className="flex items-center space-x-1 bg-gray-200 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Delete"
        >
          <FaTrash />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default BillCard;
