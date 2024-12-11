import { React, useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import CustomModal from '../modal/CustomModal';
import getInitials from '../../helpers/getInitials';

const colors = ['#4CAF50', '#FF9800', '#2196F3', '#FF5722', '#9C27B0'];

const BillCard = ({ bills, onEdit, onDelete, onSettleUp }) => {
  return (
    <>
      {bills.map((bill) => {
        const serverBaseUrl = 'http://localhost:3000/images/';
        const imageName = bill.category_id.imagePath.split('\\').pop();
        const formattedImagePath = `${serverBaseUrl}/${imageName}`;

        const totalContribution = bill.amount;

        return (
          <div
            key={bill._id} // Make sure to add a unique key for each bill item
            className="flex flex-col bg-white shadow-md rounded-lg p-6 w-full border-l-4 border-lime-500 hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            {/* Header with title and category */}
            <div className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-red-200 rounded-full flex items-center justify-center">
                  <img
                    src={formattedImagePath}
                    className="p-2"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {bill.title}
                  </h2>
                  <p className="text-base text-gray-500">
                    {bill.category_id.name || 'No Category'}
                  </p>
                </div>
              </div>

              {/* Buttons aligned at the right */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the `onClick`
                    onEdit(bill);
                  }}
                  className="flex items-center space-x-1 bg-lime-300 text-gray-800 hover:text-gray-900 hover:bg-green-600 focus:outline-none"
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the `onClick`
                    onDelete(bill);
                  }}
                  className="flex items-center space-x-1 bg-red-400 text-gray-800 hover:text-gray-200 hover:bg-red-600 focus:outline-none"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Bill description and date */}
            <p className="text-base text-gray-500 mt-2">{bill.description}</p>
            <p className="text-base text-gray-500 mt-2">
              Bill Split on {new Date(bill.date).toLocaleDateString()}
            </p>

            {/* Split Type */}
            <p className="text-base text-gray-500 mt-2">
              Split Type:
              {(() => {
                if (bill.splitType === 'percent') {
                  return ' Percentage';
                } else if (bill.splitType === 'amountOwed') {
                  return ' Amount';
                } else {
                  return ' Evenly';
                }
              })()}
            </p>

            {/* Paid By */}
            <p className="text-base text-gray-500 mt-2">
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
                  let percentage;
                  let amountOwed;

                  if (bill.splitType === 'percent') {
                    // Percent split logic
                    percentage = detail.percent || 0;
                    amountOwed = (
                      totalContribution *
                      (percentage / 100)
                    ).toFixed(2);
                  } else if (
                    bill.splitType === 'amountOwed' ||
                    bill.splitType === 'evenly'
                  ) {
                    // Amount owed logic
                    amountOwed = detail.amountOwed || 0;
                    percentage = (
                      (amountOwed / totalContribution) *
                      100
                    ).toFixed(2);
                  } else {
                    // Default case
                    percentage = 0;
                    amountOwed = 0;
                  }

                  const color = colors[index % colors.length];

                  return (
                    <div
                      key={detail.user_id._id}
                      title={`${detail.user_id.firstName || 'User'}: ${
                        bill.splitType === 'percent'
                          ? `${percentage}%`
                          : `$${amountOwed}`
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
              {bill.splitDetails.map((detail, index) => {
                let displayValue;
                if (bill.splitType === 'percent') {
                  displayValue = `${detail.percent || 0}%`;
                } else {
                  displayValue = `$${detail.amountOwed || 0}`;
                }

                return (
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
                    <span>{displayValue}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSettleUp(bill);
                }}
                className="flex items-center space-x-1 bg-green-600 text-base text-white hover:text-gray-100 focus:outline-none"
                aria-label="Settle Up"
              >
                <FaMoneyBillTransfer />
                <span>Settle Up</span>
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default BillCard;
