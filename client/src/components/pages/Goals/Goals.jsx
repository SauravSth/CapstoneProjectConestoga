import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Navbar from '../../../layouts/Navbar.jsx';
import Header from '../../../layouts/Header.jsx';
import CustomModal from '../../modal/CustomModal.jsx';
import GoalCard from './GoalCard.jsx';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Modal for updating goal
  const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false); // Modal for updating goal
  const [selectedGoal, setSelectedGoal] = useState(null); // Track the selected goal
  const [savedAmount, setSavedAmount] = useState('');

  // Form state for creating a new goal
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [description, setDescription] = useState('');

  // Fetch goals from the API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/goal`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
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
    setEditDetailsModalOpen(false);
    setIsDetailsModalOpen(false);
    setGoalTitle('');
    setTargetAmount(0);
    setDescription('');
  };

  const handleFormSubmit = async () => {
    try {
      const newGoal = {
        title: goalTitle,
        goalAmount: Number(targetAmount),
        description: description,
      };

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/goal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newGoal),
        }
      );

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

  const handleEditFormSubmit = async () => {
    const updatedGoal = {
      title: goalTitle,
      goalAmount: targetAmount,
      description: description,
      savedAmount: 0,
    };

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/goal/${
        selectedGoal._id
      }`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedGoal), // Send updated goal details
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update the goal');
    }

    const updatedData = await response.json();

    // Update state with the modified goal
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === selectedGoal._id ? { ...goal, ...updatedData } : goal
      )
    );

    // Close the modal
    setEditDetailsModalOpen(false);
    console.log('Goal updated successfully:', updatedData);
    console.error('Error updating goal:', error);
  };

  // Handle view details to open the update modal
  const handleViewDetails = (goal) => {
    setSelectedGoal(goal);
    setSavedAmount(0); // Pre-fill the saved amount
    setIsDetailsModalOpen(true);
  };

  // Handle view details to open the update modal
  const handleEditDetails = (goal) => {
    setGoalTitle(goal.title);
    setTargetAmount(goal.goalAmount);
    setDescription(goal.description);
    setSelectedGoal(goal);
    setEditDetailsModalOpen(true);
  };

  const handleDelete = async (goal) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/goal`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ _id: goal._id }), // Assuming '_id' uniquely identifies the goal
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete goal. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Goal deleted successfully:', data);

      // Update the state to remove the deleted goal
      setGoals((prevGoals) => prevGoals.filter((g) => g._id !== goal._id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      console.log('Delete operation complete');
    }
  };

  // Handle updating the saved amount
  const handleUpdateSavedAmount = async () => {
    if (!selectedGoal) return;

    try {
      const updatedGoal = {
        ...selectedGoal,
        _id: selectedGoal._id,
        savedAmount: selectedGoal.savedAmount + Number(savedAmount),
      };

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/goal/${
          selectedGoal._id
        }`,
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
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="Goals" />

        <main className="p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">Goals</h1>
            <p className="text-gray-500 mt-1">Set Goals for your future</p>
          </div>

          {/* New Goal Button */}
          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none transition duration-150"
              onClick={handleNewGoal}
            >
              <FaPlus className="inline mr-2" /> New Goal
            </button>
          </div>

          {/* Goals Grid */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal._id}
                  name={goal.title}
                  description={goal.description}
                  createdDate={goal.createdAt}
                  goalAmount={goal.goalAmount}
                  savedAmount={goal.savedAmount ?? 0}
                  onClick={() => handleViewDetails(goal)}
                  onEditClick={() => handleEditDetails(goal)}
                  onDeleteClick={() => handleDelete(goal)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Create Goal Modal */}
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
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description"
              ></textarea>
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
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Saved Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none transition duration-150"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-150"
                onClick={handleUpdateSavedAmount}
              >
                Update
              </button>
            </div>
          </form>
        </CustomModal>

        <CustomModal
          title="Edit Goal"
          isOpen={editDetailsModalOpen}
          onClose={() => setEditDetailsModalOpen(false)}
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
                id="targetAmount"
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
                onClick={() => setEditDetailsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 ml-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
                onClick={handleEditFormSubmit}
              >
                Save Changes
              </button>
            </div>
          </form>
        </CustomModal>
      </div>
    </div>
  );
};

export default Goals;
