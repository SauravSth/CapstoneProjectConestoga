import React, { useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import PieChartComponent from '../../ui/PieChart';
import { FaUsers, FaFileInvoiceDollar } from 'react-icons/fa';
import { RiBillFill } from 'react-icons/ri';
import { MdGroups } from 'react-icons/md';

// Sample data for the PieChart

const Home = () => {
  const chartData = [
    { name: 'Housing', value: 400 },
    { name: 'Food', value: 300 },
    { name: 'Transportation', value: 200 },
    { name: 'Others', value: 100 },
  ];

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg h-full">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="Overview" />

        <main className="p-4 sm:p-8 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">👋 Welcome User</h1>
            <p className="text-gray-500 mt-1">
              Keep track of your financial plan
            </p>
          </div>

          {/* Expenses Chart & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expenses Chart */}
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow w-full">
              <h2 className="text-xl sm:text-2xl font-bold">Expenses</h2>
              <p className="text-2xl sm:text-3xl font-semibold mt-4">$124,543</p>
              <p className="text-gray-500">Total expense</p>
              <div className="mt-6">
                <PieChartComponent data={chartData} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 sm:space-y-6 w-full">
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white p-4 sm:p-8 rounded-lg shadow text-center w-full">
                  <RiBillFill className="text-2xl sm:text-4xl mx-auto text-blue-500" />
                  <p className="mt-2 font-semibold text-sm sm:text-base text-gray-500">
                    Split a Bill
                  </p>
                </button>
                <button className="bg-white p-4 sm:p-8 rounded-lg shadow text-center w-full">
                  <MdGroups className="text-2xl sm:text-4xl mx-auto text-green-500" />
                  <p className="mt-2 font-semibold text-sm sm:text-base text-gray-500">
                    Saving Group
                  </p>
                </button>
              </div>

              <div className="bg-white py-6 sm:py-10 px-4 sm:px-8 rounded-lg shadow w-full">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaUsers className="text-blue-500 mr-2" /> Members
                </h3>
                <p className="text-gray-500">Last update on August 28, 2022</p>
                <p className="text-xl sm:text-2xl font-bold mt-4">8</p>
              </div>
              <div className="bg-white py-6 sm:py-10 px-4 sm:px-8 rounded-lg shadow w-full">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaFileInvoiceDollar className="text-yellow-500 mr-2" /> Bills
                </h3>
                <p className="text-gray-500">Last update on August 28, 2022</p>
                <p className="text-xl sm:text-2xl font-bold mt-4">8</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
