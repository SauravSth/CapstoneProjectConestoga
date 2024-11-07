import React from 'react';

const BudgetCard = ({ name, description, createdDate, totalAmount }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="text-gray-500 text-sm">
        <span>Created Date: {new Date(createdDate).toLocaleDateString()}</span>
      </div>
      <div className="text-gray-900 font-bold mt-4">
        Total Amount: ${totalAmount}
      </div>
    </div>
  );
};

export default BudgetCard;
