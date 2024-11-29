import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import CustomModal from '../../modal/CustomModal';

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

  const columns = [
    { field: 'title', headerName: 'Expense Title' },
    { field: 'category', headerName: 'Category' },
    { field: 'date', headerName: 'Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'type', headerName: 'Type' }, // Add a column to indicate type (personal/group)
  ];

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
        group_id: isGroupExpense ? 'group_id_placeholder' : null, // Adjust group_id based on type
        type: isGroupExpense ? 'Group' : 'Personal', // Include type in the model
      };

      const response = await fetch('http://localhost:3000/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      const data = await response.json();
      console.log(newExpense);
      console.log('adrta', data);

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
    setIsGroupExpense(false); // Reset the toggle switch
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
          type: expense.group_id ? 'Group' : 'Personal', // Determine type dynamically
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
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="All Expenses" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>

          <div className="flex items-center justify-between mt-4 max-w-full">
            <div className="flex items-center space-x-4 max-w-lg">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title or category"
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

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={filteredData}
            />
          )}
        </main>

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
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
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
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 mr-4">Group Expense</label>
              <input
                type="checkbox"
                checked={isGroupExpense}
                onChange={() => setIsGroupExpense(!isGroupExpense)}
                className="w-5 h-5"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
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
