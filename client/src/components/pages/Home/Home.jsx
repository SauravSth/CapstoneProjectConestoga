import React, { useState, useEffect } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import PieChartComponent from '../../ui/PieChart';
import LineChartComponent from '../../ui/PieChart';
import { FaUsers, FaFileInvoiceDollar } from 'react-icons/fa';
import { RiBillFill } from 'react-icons/ri';
import { MdGroups } from 'react-icons/md';

// Sample data for the PieChart

const Home = () => {
  const [pieChartData, setPieChartData] = useState([]);
  useEffect(() => {
    const fetchPieData = async () => {
      const response = await fetch(
        'http://localhost:3000/api/graph/getExpensePerCategory',
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      const data = await response.json();
      console.log('pieData', data);

      setPieChartData(Array.isArray(data) ? data : data.graphData || []);
    };

    fetchPieData();
  }, []);

  const chartData = pieChartData.map((item) => ({
    name: item.category,
    value: item.amountSpent,
  }));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="Overview" />

        {/* Main Content */}
        <main className="p-8 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-4xl font-bold">👋 Welcome User</h1>
            <p className="text-gray-500 mt-1">
              Keep track of your financial plan
            </p>
          </div>

          {/* Expenses Chart & Quick Actions */}
          <div className="grid grid-cols-3 gap-6">
            {/* Expenses Chart */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow h-[40rem]">
              <h2 className="text-2xl font-bold">Expenses</h2>
              <p className="text-3xl font-semibold mt-4">
                ${pieChartData.reduce((sum, item) => sum + item.amountSpent, 0)}
              </p>
              <p className="text-gray-500">Total expense</p>
              {/* Pie Chart Component */}
              <div className="mt-6">
                <PieChartComponent data={chartData} />
              </div>
            </div>

            <div className="col-span-2 bg-white p-6 rounded-lg shadow h-[40rem]">
              <h2 className="text-2xl font-bold">Expenses</h2>
              <p className="text-3xl font-semibold mt-4">
                ${pieChartData.reduce((sum, item) => sum + item.amountSpent, 0)}
              </p>
              <p className="text-gray-500">Total expense</p>
              {/* Pie Chart Component */}
              <div className="mt-6">
                <LineChartComponent data={chartData} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white p-12 rounded-lg shadow text-center">
                  <RiBillFill className="text-4xl mx-auto text-blue-500" />
                  <p className="mt-2 font-semibold text-gray-500">
                    Split a Bill
                  </p>
                </button>
                <button className="bg-white p-12 rounded-lg shadow text-center">
                  <MdGroups className="text-4xl mx-auto text-green-500" />
                  <p className="mt-2 font-semibold text-gray-500">
                    Saving Group
                  </p>
                </button>
              </div>

              {/* Members and Bills */}
              <div className="bg-white py-10 px-8 rounded-lg shadow">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaUsers className="text-blue-500 mr-2" /> Members
                </h3>
                <p className="text-gray-500">Last update on August 28, 2022</p>
                <p className="text-2xl font-bold mt-4">8</p>
              </div>
              <div className="bg-white py-10 px-8 rounded-lg shadow">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaFileInvoiceDollar className="text-yellow-500 mr-2" /> Bills
                </h3>
                <p className="text-gray-500">Last update on August 28, 2022</p>
                <p className="text-2xl font-bold mt-4">8</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
