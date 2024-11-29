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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Modal for updating goal
  const [selectedGoal, setSelectedGoal] = useState(null); // Track the selected goal
  const [savedAmount, setSavedAmount] = useState('');

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
        const response = await fetch(`http://localhost:3000/api/goal`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const goalsData = await response.json();
        setGoals(Array.isArray(goalsData) ? goalsData : goalsData.goals || []);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

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
        goalAmount: Number(targetAmount),
        description: description,
      };

      const response = await fetch('http://localhost:3000/api/goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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

  // Handle view details to open the update modal
  const handleViewDetails = (goal) => {
    setSelectedGoal(goal);
    setSavedAmount(goal.savedAmount ?? 0); // Pre-fill the saved amount
    setIsDetailsModalOpen(true);
  };

  // Handle updating the saved amount
  const handleUpdateSavedAmount = async () => {
    if (!selectedGoal) return;

    try {
      const updatedGoal = {
        ...selectedGoal,
        savedAmount: Number(savedAmount),
      };

      const response = await fetch(
        `http://localhost:3000/api/goal/${selectedGoal._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedGoal),
        }
      );

      if (response.ok) {
        setGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal._id === selectedGoal._id
              ? { ...goal, savedAmount: updatedGoal.savedAmount }
              : goal
          )
        );
        setIsDetailsModalOpen(false);
      } else {
        console.error('Error updating goal');
      }
    } catch (error) {
      console.error('Error updating saved amount:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="Goals" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">Goals</div>
          <div className="text-gray-500">Set Goals for your future</div>

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
                  goalAmount={goal.goalAmount}
                  savedAmount={goal.savedAmount ?? 0}
                  onClick={() => handleViewDetails(goal)}
                />
              ))}
            </div>
          )}
        </main>

        <CustomModal
          title="Create New Goal"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label
                htmlFor="goalTitle"
                className="block text-gray-700"
              >
                Goal Title
              </label>
              <input
                id="goalTitle"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="Enter your goal title"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="targetAmount"
                className="block text-gray-700"
              >
                Goal Amount
              </label>
              <input
                id="goalAmount"
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Enter the target amount"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description"
                rows="4"
                required
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
                Create Goal
              </button>
            </div>
          </form>
        </CustomModal>

        {/* Update Saved Amount Modal */}
        <CustomModal
          title="Update Saved Amount"
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Saved Amount</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 ml-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
              onClick={handleUpdateSavedAmount}
            >
              Update
            </button>
          </div>
        </CustomModal>
      </div>
    </div>
  );
};

export default Goals;
