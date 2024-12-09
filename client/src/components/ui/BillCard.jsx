import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import getInitials from '../../helpers/getInitials';

const colors = ['#4CAF50', '#FF9800', '#2196F3', '#FF5722', '#9C27B0'];

const BillCard = ({
  bill = {
    title: 'Grocery Shopping',
    category: 'Groceries',
    date: '2024-12-18',
    amount: 502,
    remainingAmount: 0,
    splitType: 'percent',
    description: 'Monthly grocery expenses for December',
    paidBy: 'John Doe',
    groupId: '6751d8e902dff53a25a21a77',
    splitDetails: [
      { userId: '1', userName: 'John Doe', percentage: 50, amountOwed: 251 },
      { userId: '2', userName: 'Jane Smith', percentage: 30, amountOwed: 150 },
      { userId: '3', userName: 'Alice Brown', percentage: 20, amountOwed: 101 },
    ],
  },
  onEdit,
  onDelete,
}) => {
  const {
    title,
    category,
    date,
    amount,
    remainingAmount,
    splitDetails,
    splitType,
    paidBy,
    description,
  } = bill;

  const totalContribution = splitDetails.reduce(
    (sum, detail) => sum + (detail.amountOwed || 0),
    0
  );

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-6 w-full border-l-4 border-lime-500 hover:shadow-lg transition-shadow duration-200 ease-in-out">
      {/* Header with title and category */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
          <span
            role="img"
            aria-label="icon"
          >
            🧾
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{category || 'No Category'}</p>
        </div>
      </div>

      {/* Bill description and date */}
      <p className="text-sm text-gray-500 mt-2">{description}</p>
      <p className="text-sm text-gray-500 mt-2">
        Bill Split on {new Date(date).toLocaleDateString()}
      </p>

      {/* Split Type */}
      <p className="text-sm text-gray-500 mt-2">Split Type: {splitType}</p>

      {/* Paid By */}
      <p className="text-sm text-gray-500 mt-2">Paid By: {paidBy}</p>

      {/* User Initials Avatars */}
      <div className="flex items-center space-x-2 mt-4">
        {splitDetails.map((detail, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-800 font-semibold text-base border-2 border-white shadow-sm"
          >
            {getInitials(detail.userName || 'NA')}
          </div>
        ))}
      </div>

      {/* Total and Remaining amount */}
      <div className="mt-4">
        <p className="text-2xl font-bold text-green-500">Total: ${amount}</p>
        <p className="text-lg text-yellow-500">Remaining: ${remainingAmount}</p>
      </div>

      {/* Contribution Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-4 rounded-full bg-gray-200 flex overflow-hidden">
          {splitDetails.map((detail, index) => {
            const percentage =
              splitType === 'percent'
                ? detail.percentage || 0
                : ((detail.amountOwed || 0) / totalContribution) * 100;
            const color = colors[index % colors.length];

            return (
              <div
                key={detail.userId}
                title={`${detail.userName || 'User'}: ${
                  splitType === 'percent'
                    ? `${percentage}%`
                    : `$${detail.amountOwed}`
                }`}
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
        {splitDetails.map((detail, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <span className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span>{detail.userName || 'User'}</span>
            </span>
            <span>
              {splitType === 'percent'
                ? `${detail.percentage || 0}%`
                : `$${detail.amountOwed || 0}`}
            </span>
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
