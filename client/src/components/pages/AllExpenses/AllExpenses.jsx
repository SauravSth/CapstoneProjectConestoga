import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import CustomModal from '../../modal/CustomModal';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import useAuthStore from '../../../store/useAuthStore.js';

const AllExpenses = () => {
  const { user } = useAuthStore();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGroupExpense, setIsGroupExpense] = useState(false);
  const [expandedCards, setExpandedCards] = useState({}); // Track expanded state for each card

  const columns = [
    { field: 'title', headerName: 'Expense Title' },
    { field: 'category', headerName: 'Category' },
    { field: 'date', headerName: 'Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'type', headerName: 'Type' },
  ];

  const toggleCardDetails = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state for the specific card
    }));
  };

  const handleNewExpense = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!expenseName || !category || !amount) {
      alert('Please fill out all fields');
      return;
    }
    try {
      const newExpense = {
        title: expenseName,
        date: new Date().toISOString().slice(0, 10),
        amount: Number(amount),
        category_id: category,
        group_id: isGroupExpense ? 'group_id_placeholder' : null,
        type: isGroupExpense ? 'Group' : 'Personal',
      };

      const response = await fetch('http://localhost:3000/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setData((prevData) => [...prevData, data.newExpense]);
        closeModal();
        resetFormFields();
      } else {
        alert('Error submitting expense');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error submitting new expense:', error);
    }
  };

  const resetFormFields = () => {
    setExpenseName('');
    setCategory('');
    setAmount('');
    setIsGroupExpense(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormFields();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = data.filter(
      (expense) =>
        expense.title.toLowerCase().includes(value.toLowerCase()) ||
        expense.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const expenseResponse = await fetch(
          'http://localhost:3000/api/expense',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!expenseResponse.ok) {
          throw new Error(`HTTP error! Status: ${expenseResponse.status}`);
        }

        const expenseData = await expenseResponse.json();
        const formattedData = expenseData.expenses.map((expense) => ({
          ...expense,
          category: expense.category_id?.name || 'Unknown Category',
          date: new Date(expense.date).toLocaleDateString('en-US'),
          type: expense.group_id ? 'Group' : 'Personal',
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await fetch(
          `http://localhost:3000/api/category`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="All Expenses" />

        <main className="p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">My Wallet</h1>
            <p className="text-gray-500 mt-1">Keep track of your financial plan</p>
          </div>

          {/* Search and Add New Expense */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title or category"
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none">
                Filter by Date
              </button>
            </div>
            <button
              className="px-4 py-2 text-black rounded-lg focus:outline-none"
              style={{ backgroundColor: '#80C028', opacity: '0.45' }}
              onClick={handleNewExpense}
            >
              + New Expense
            </button>
          </div>

          {/* Expense Table or Card View */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <>
              {/* Table View for larger screens */}
              <div className="hidden sm:block">
                <CustomTable columns={columns} data={filteredData} />
              </div>

              {/* Card View for smaller screens */}
              <div className="sm:hidden space-y-4">
                {filteredData.map((expense) => (
                  <div
                    key={expense._id}
                    className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800 flex-grow">
                        {expense.title}
                      </h3>
                      <span className="text-lg font-bold text-green-600 ml-4">
                        ${expense.amount}
                      </span>
                      <button
                        className="ml-4 text-gray-500"
                        onClick={() => toggleCardDetails(expense._id)}
                      >
                        {expandedCards[expense._id] ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    </div>
                    {expandedCards[expense._id] && (
                      <div className="mt-4 text-sm text-gray-600 grid grid-cols-2 gap-2">
                        <span>{expense.category}</span>
                        <span className="text-right">{expense.date}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>



            </>
          )}
        </main>

        {/* Add New Expense Modal */}
        <CustomModal
          title="Add New Expense"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Expense Title</label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
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
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
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
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 mr-4">Group Expense</label>
              <input
                type="checkbox"
                checked={isGroupExpense}
                onChange={() => setIsGroupExpense(!isGroupExpense)}
                className="w-5 h-5"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none transition duration-150"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-150"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </CustomModal>
      </div>
    </div>
  );
};

export default AllExpenses;
