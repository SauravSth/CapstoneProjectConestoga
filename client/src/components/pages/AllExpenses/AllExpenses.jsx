import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import CustomModal from '../../modal/CustomModal';

const AllExpenses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]); // State for storing category data

  const columns = [
    { field: 'title', headerName: 'Expense Title' },
    { field: 'category', headerName: 'Category' },
    { field: 'date', headerName: 'Date' },
    // { field: 'paidTo', headerName: 'Paid To' },
    { field: 'amount', headerName: 'Amount' },
  ];

  const handleNewExpense = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = () => {
    const newExpense = {
      id: data.length + 1, // Sample ID, update based on real data
      expenseName,
      category,
      date: new Date().toISOString().slice(0, 10), // Current date
      amount,
    };

    setData((prevData) => [...prevData, newExpense]);
    setIsModalOpen(false); // Close modal after submission
    setExpenseName(''); // Reset input fields
    setCategory('');
    setAmount('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const expenseResponse = await fetch(
          'http://localhost:3000/api/expenses'
        );
        const expenseData = await expenseResponse.json();
        setData(expenseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/category', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();

        // Ensure result is an array of categories
        setCategories(
          Array.isArray(result.categories) ? result.categories : []
        );
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="All Expenses" />

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
              onClick={handleNewExpense}
            >
              + New Expense
            </button>
          </div>

          {/* Expenses Table */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={data}
            />
          )}
        </main>

        {/* Custom Modal for Adding New Expense */}
        <CustomModal
          title="Add New Expense"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Expense Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 ml-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
                onClick={handleFormSubmit}
              >
                Confirm
              </button>
            </div>
          </form>
        </CustomModal>
      </div>
    </div>
  );
};

export default AllExpenses;
