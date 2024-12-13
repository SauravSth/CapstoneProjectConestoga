import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import BudgetTable from '../../table/BudgetTable.jsx';
import CustomModal from '../../modal/CustomModal';

import { useParams } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore.js';

const BudgetExpense = () => {
  const { user } = useAuthStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [budgets, setBudgets] = useState({});
  const { budgetId } = useParams(); // To track the budget for each category

  const [error, setError] = useState('');

  console.log('budet', budgetId);

  const columns = [
    { field: 'title', headerName: 'Title' },
    { field: 'amount', headerName: 'Amount' },
    {
      field: 'date',
      headerName: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      field: 'category_id.name',
      headerName: 'Category',
      render: (row) => row.category_id?.name || 'N/A',
    },
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
        budget_id: budgetId,
      };

      console.log('HERE is the epxense data', newExpense);
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/expense`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newExpense),
        }
      );

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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormFields();
  };

  // Handle setting the budget for a category
  const handleBudgetChange = (categoryId, budgetAmount) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [categoryId]: budgetAmount,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_SERVER_URL
          }/api/expense?budget_id=${budgetId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const expenseData = await response.json();
        setData(expenseData.expenses);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [budgetId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/category`,
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
  }, [user]);

  const calculateTotalExpenseForCategory = (categoryId) => {
    return data
      .filter((expense) => expense.category_id._id === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };
  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="Budget Expenses" />

        <main className="p-4 sm:p-6 space-y-6">
          <div className="text-3xl sm:text-5xl font-bold">Budget Management</div>
          <div className="text-gray-500 text-sm sm:text-base">
            Keep track of your spending and budgets
          </div>

          {/* Search Bar and Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-[400px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto space-y-2 sm:space-y-0">
              <button
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg focus:outline-none hover:bg-green-700 text-center"
                onClick={handleNewExpense}
              >
                + New Expense
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Budget Table or Card View */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <>
              {/* Table View for larger screens */}
              <div className="hidden sm:block">
                <BudgetTable columns={columns} data={data} />
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4">
                {data.map((expense) => (
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
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
                      <span>{expense.category_id?.name || 'N/A'}</span>
                      <span className="text-right">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
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
                <option value="" disabled>
                  -- Select a Category --
                </option>
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
                min="0"
              />
            </div>
            <button
              type="submit"
              onClick={handleFormSubmit}
              disabled={!expenseName || !category || !amount}
              className={`w-full px-4 py-2 text-white rounded-lg ${expenseName && category && amount
                  ? 'bg-blue-500'
                  : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              Add Expense
            </button>
          </form>
        </CustomModal>
      </div>
    </div>

  );
};

export default BudgetExpense;
