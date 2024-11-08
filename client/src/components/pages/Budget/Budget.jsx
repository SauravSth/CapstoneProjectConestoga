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

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleNewBudget = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
  }, []);

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
            // <div className="budget-cards">
            //   {data.map((budget) => (
            //     <div
            //       key={budget._id}
            //       className="budget-card"
            //       onClick={() => handleCardClick(budget._id)}
            //       style={{ cursor: 'pointer' }}
            //     >
            //       <h3>{budget.title}</h3>
            //       <p>Budget: ${budget.upperLimit}</p>
            //       <p>Remaining: ${budget.lowerLimit}</p>
            //     </div>
            //   ))}
            // </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.map((budget, index) => (
                <BudgetCard
                  key={index}
                  name={budget.title}
                  description={budget.user_id}
                  createdDate={budget.createdDate}
                  totalAmount={budget.totalAmount}
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
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
          </form>
        </CustomModal>
      </div>
    </div>
  );
};

export default Budget;
