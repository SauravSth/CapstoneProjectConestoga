import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';

const AllExpenses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: 'expenseName', headerName: 'Expense Name' },
    { field: 'category', headerName: 'Category' },
    { field: 'date', headerName: 'Date' },
    { field: 'paidTo', headerName: 'Paid To' },
    { field: 'amount', headerName: 'Amount' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/expenses');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="All Expenses" />

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>

          {/* Search, Filter, and New Expense */}
          <div className="flex items-center justify-between mt-4 max-w-full">
            <div className="flex items-center space-x-4 max-w-lg">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none">
                Filter by Date
              </button>
            </div>
            <button
              className="ml-4 px-4 py-2 text-black rounded-lg focus:outline-none"
              style={{
                backgroundColor: '#80C028',
                opacity: '0.45',
              }}
            >
              + New Expense
            </button>
          </div>

          {/* Expenses Table */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <CustomTable columns={columns} data={data} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AllExpenses;
