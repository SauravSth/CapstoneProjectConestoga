import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
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

  const columns = [
    { field: 'title', headerName: 'Expense Title' },
    { field: 'category', headerName: 'Category' },
    { field: 'date', headerName: 'Date' },
    { field: 'amount', headerName: 'Amount' },
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
        user_id: user,
        group_id: null,
      };

      console.log('HERE is the epxense data', newExpense);
      const response = await fetch('http://localhost:3000/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newExpense),
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
        const expenseResponse = await fetch(
          `http://localhost:3000/api/expense`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        const expenseData = await expenseResponse.json();
        console.log('Expense Data', expenseData);

        const filteredData = expenseData.expenses.filter(
          (expense) => expense.category_id === budgetId
        );

        const formattedData = filteredData.map((expense) => ({
          ...expense,
          category: expense.category_id?.name || 'Unknown Category',
          date: new Date(expense.date).toLocaleDateString(),
          user: expense.user_id?.username || 'Unknown User',
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, budgetId]);

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
  }, [user]);

  const calculateTotalExpenseForCategory = (categoryId) => {
    return data
      .filter((expense) => expense.category_id === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="Budget Expenses" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">Budget Management</div>
          <div className="text-gray-500">
            Keep track of your spending and budgets
          </div>

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

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={data}
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
                {categories.map((category) => (
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
                min="0"
              />
            </div>
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg"
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
