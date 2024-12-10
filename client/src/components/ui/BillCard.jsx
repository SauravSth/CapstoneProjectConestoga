import { React, useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import getInitials from '../../helpers/getInitials';

const colors = ['#4CAF50', '#FF9800', '#2196F3', '#FF5722', '#9C27B0'];

const BillCard = ({ bills, onEdit, onDelete }) => {
  console.log('Bill Card', bills);

  const totalContribution = 5000;

  return (
    <>
      {bills.map((bill) => {
        const serverBaseUrl = 'http://localhost:3000'; // Replace with your server URL in production
        const formattedImagePath = `${serverBaseUrl}/${bill.category_id.imagePath.replace(
          /\\/g,
          '/'
        )}`;
        return (
          <div
            key={bill._id} // Make sure to add a unique key for each bill item
            className="flex flex-col bg-white shadow-md rounded-lg p-6 w-full border-l-4 border-lime-500 hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            {/* Header with title and category */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                <img src={formattedImagePath} />
                {/* <span
                  role="img"
                  aria-label="icon"
                >
                  🧾
                </span> */}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {bill.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {bill.category_id.name || 'No Category'}
                </p>
              </div>
            </div>

            {/* Bill description and date */}
            <p className="text-sm text-gray-500 mt-2">{bill.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Bill Split on {new Date(bill.date).toLocaleDateString()}
            </p>

            {/* Split Type */}
            <p className="text-sm text-gray-500 mt-2">
              Split Type: {bill.splitType}
            </p>

            {/* Paid By */}
            <p className="text-sm text-gray-500 mt-2">
              {`Paid By: ${bill.paid_by.firstName} ${bill.paid_by.lastName}`}
            </p>

            {/* User Initials Avatars */}
            <div className="flex items-center space-x-2 mt-4">
              {bill.splitDetails.map((detail, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-800 font-semibold text-base border-2 border-white shadow-sm"
                >
                  {getInitials(
                    `${detail.user_id.firstName} ${detail.user_id.lastName}` ||
                      'NA'
                  )}
                </div>
              ))}
            </div>

            {/* Total and Remaining amount */}
            <div className="mt-4">
              <p className="text-2xl font-bold text-green-500">
                Total: ${bill.amount}
              </p>
            </div>

            {/* Contribution Progress Bar */}
            <div className="mt-4">
              <div className="w-full h-4 rounded-full bg-gray-200 flex overflow-hidden">
                {bill.splitDetails.map((detail, index) => {
                  const percentage =
                    bill.splitType === 'percent'
                      ? detail.percent || 0
                      : ((detail.amountOwed || 0) / totalContribution) * 100;
                  const color = colors[index % colors.length];

                  return (
                    <div
                      key={detail.user_id._id}
                      title={`${detail.user_id.firstName || 'User'}: ${
                        bill.splitType === 'percent'
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
              {bill.splitDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: colors[index % colors.length],
                      }}
                    ></span>
                    <span>{detail.user_id.firstName || 'User'}</span>
                  </span>
                  <span>
                    {bill.splitType === 'percent'
                      ? `${detail.percent || 0}%`
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
      })}
    </>
  );
};

export default BillCard;
