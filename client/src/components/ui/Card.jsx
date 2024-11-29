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
  const remainingPercentage = ((remainingAmount / totalAmount) * 100).toFixed(
    2
  );

  return (
    <div
      className="card bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto md:max-w-md hover:shadow-lg transition-all transform hover:scale-105 w-full"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">
          Created: {new Date(createdDate).toLocaleDateString()}
        </p>
      </div>
      <p className="mt-2 text-gray-600">{description}</p>
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
      <div className="mt-6">
        <button
          onClick={onClick}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
