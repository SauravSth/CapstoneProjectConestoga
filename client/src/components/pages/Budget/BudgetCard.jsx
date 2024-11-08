import React from 'react';

const BudgetCard = ({
  name,
  description,
  createdDate,
  totalAmount,
  remainingAmount,
  onClick,
}) => {
  // Calculate the percentage of the remaining budget
  const remainingPercentage = ((remainingAmount / totalAmount) * 100).toFixed(
    2
  );

  return (
    <div
      className="budget-card p-4 bg-white rounded-lg shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-600">{description}</p>
      <p className="text-gray-500 text-sm">
        Created on: {new Date(createdDate).toLocaleDateString()}
      </p>
      <p className="font-semibold">Total Amount: ${totalAmount}</p>
      <p className="text-red-600">Remaining: ${remainingAmount}</p>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full"
            style={{
              width: `${remainingPercentage}%`,
              backgroundColor: remainingPercentage > 25 ? '#80C028' : '#FF4500', // Green if more than 25% remaining, Red otherwise
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {remainingPercentage}% Remaining
        </p>
      </div>
    </div>
  );
};

export default BudgetCard;
