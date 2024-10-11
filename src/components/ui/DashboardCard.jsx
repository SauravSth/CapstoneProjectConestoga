import React from 'react';

const DashboardCard = ({ cardIcon, cardTitle }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <div className="text-lg font-semibold">
        {cardIcon} {cardTitle}
      </div>
      <div className="text-sm text-gray-500">Last Paid on August 28, 2022</div>
      <div className="text-xl font-bold">$300 / $1000</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: '30%' }}
        ></div>
      </div>
      <div className="text-sm text-gray-500">30%</div>
    </div>
  );
};

export default DashboardCard;
