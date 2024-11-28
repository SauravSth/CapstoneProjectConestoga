import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Navbar from '../../../layouts/Navbar.jsx';
import Header from '../../../layouts/Header.jsx';
import CustomModal from '../../modal/CustomModal.jsx';
import GoalCard from './GoalCard.jsx';
import useAuthStore from '../../../store/useAuthStore.js';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating a new goal
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [description, setDescription] = useState('');

  const { user } = useAuthStore();

  // Fetch goals from the API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        console.log(user);
        const response = await fetch(`http://localhost:3000/api/goal`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const goalsData = await response.json();
        setGoals(Array.isArray(goalsData) ? goalsData : goalsData.goals || []);
        console.log('Goals data', goals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const handleNewGoal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setGoalTitle('');
    setTargetAmount('');
    setDescription('');
  };

  const handleFormSubmit = async () => {
    try {
      const newGoal = {
        title: goalTitle,
        amount: Number(targetAmount),
        description: description,
        user_id: user,
        // createdAt: new Date(),
      };

      const response = await fetch('http://localhost:3000/api/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });

      const data = await response.json();

      if (response.ok) {
        setGoals((prevGoals) => [...prevGoals, data.newGoal]);
        closeModal();
      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error submitting new goal:', error);
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
        <Header title="Goals" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">Goals</div>
          <div className="text-gray-500">Set Goals for your future</div>

          {/* New Goal Button */}
          <div className="flex items-center justify-between mt-4 max-w-full">
            <button
              className="ml-4 px-4 py-2 text-black rounded-lg focus:outline-none"
              style={{
                backgroundColor: '#80C028',
                opacity: '0.45',
              }}
              onClick={handleNewGoal}
            >
              <FaPlus className="inline mr-2" /> New Goal
            </button>
          </div>

          {/* Goals List */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal._id}
                  name={goal.title}
                  description={goal.description}
                  createdDate={goal.createdAt}
                  totalAmount={goal.amount}
                  remainingAmount={goal.remainingAmount ?? 0}
                  onClick={() => console.log(`Clicked on goal: ${goal.title}`)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Custom Modal */}
        <CustomModal
          title="Create New Goal"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Goal Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Target Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
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

export default Goals;
