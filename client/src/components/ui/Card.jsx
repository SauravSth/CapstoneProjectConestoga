import React from 'react';

const Card = ({
  name,
  description,
  createdDate,
  totalAmount,
  remainingAmount,
  onClick,
  type,
}) => {
  // Calculate the percentage of the remaining amount
  const remainingPercentage = ((remainingAmount / totalAmount) * 100).toFixed(
    2
  );

  return (
    <div
      className={`card p-6 bg-white rounded-lg shadow-xl cursor-pointer transition-transform transform hover:scale-105 ${type}-card`}
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-2xl text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">
          Created on: {new Date(createdDate).toLocaleDateString()}
        </p>
      </div>

      {/* Card Details */}
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="flex items-center mt-4 space-x-4">
        <p className="font-bold text-lg text-gray-800">
          {type === 'budget' ? 'Total' : 'Target'}: ${totalAmount}
        </p>
        <p className="text-sm text-gray-600">
          {type === 'budget' ? 'Remaining' : 'Saved'}: ${remainingAmount}
        </p>{' '}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${remainingPercentage}%`,
              background: `linear-gradient(90deg, #80C028 ${remainingPercentage}%, #e0e0e0 ${remainingPercentage}%)`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {remainingPercentage}% {type === 'budget' ? 'Remaining' : 'Saved'}
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={onClick}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
