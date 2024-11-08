import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomModal from '../../modal/CustomModal';
import BudgetCard from './BudgetCard';

import useAuthStore from '../../../store/useAuthStore.js';

const Budget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating a new budget
  const [budgetTitle, setBudgetTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleNewBudget = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBudgetTitle(''); // Reset the form inputs
    setAmount('');
    setDescription('');
  };

  const handleBudgetCard = (budgetId) => {
    navigate(`/budget/${budgetId}`);
  };

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/budget?_id=${user}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const budgetData = await response.json();
        console.log('budgetData', budgetData);
        setData(
          Array.isArray(budgetData) ? budgetData : budgetData.budgets || []
        );
      } catch (error) {
        console.error('Error fetching Budget:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [user]);

  const handleFormSubmit = async () => {
    try {
      const newBudget = {
        title: budgetTitle,
        amount: Number(amount),
        remainingAmount: Number(amount),
        description: description,
        user_id: user, // User ID from auth store
        createdAt: new Date(),
      };

      console.log('newBudget', newBudget);

      const response = await fetch('http://localhost:3000/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBudget),
      });

      const data = await response.json();

      if (response.ok) {
        setData((prevData) => [...prevData, data.newBudget]); // Add new budget to the data state
        closeModal(); // Close the modal after submission
      } else {
        console.error('Error:', data); // Log error to console
      }
    } catch (error) {
      console.error('Error submitting new budget:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="Budget" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">Budget</div>
          <div className="text-gray-500">Organize your expenses by Budget</div>

          {/* Search, Filter, and New Budget */}
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
              onClick={handleNewBudget}
            >
              + Create Budget
            </button>
          </div>

          {/* Budget Cards */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.map((budget) => (
                <BudgetCard
                  key={budget._id}
                  name={budget.title}
                  description={budget.description}
                  createdDate={budget.createdAt}
                  totalAmount={budget.amount}
                  remainingAmount={budget.remainingAmount}
                  onClick={() => handleBudgetCard(budget._id)}
                />
              ))}
            </div>
          )}
        </main>

        <CustomModal
          title="Create New Budget"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Budget Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={budgetTitle}
                onChange={(e) => setBudgetTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
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

export default Budget;
