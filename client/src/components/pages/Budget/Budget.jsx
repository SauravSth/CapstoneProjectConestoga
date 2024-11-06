<<<<<<< HEAD
import React from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';

const RecentActivity = () => {
=======
import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import CustomModal from '../../modal/CustomModal';

const Budget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { field: 'name', headerName: 'Group Name' },
    { field: 'description', headerName: 'Description' },
    { field: 'createdDate', headerName: 'Created Date' },
    { field: 'totalAmount', headerName: 'Total Amount' },
  ];

  const handleNewGroup = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // useEffect(() => {
  //   const fetchBudget = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch('http://localhost:3000/api/Budget');
  //       const groupData = await response.json();
  //       setData(groupData);
  //     } catch (error) {
  //       console.error('Error fetching Budget:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBudget();
  // }, []);

>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
<<<<<<< HEAD
        <Header title="Recent Activity" />

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>
        </main>
=======
        <Header title="Budget" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">Budget</div>
          <div className="text-gray-500">Organize your expenses by Budget</div>

          {/* Search, Filter, and New Group */}
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
              onClick={handleNewGroup}
            >
              + New Group
            </button>
          </div>

          {/* Budget Table */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={data}
            />
          )}
        </main>

        {/* Custom Modal for Adding New Group */}
        <CustomModal
          title="Add New Group"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Group Name</label>
              <input
                type="text"
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
            <div className="mb-4">
              <label className="block text-gray-700">Initial Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </form>
        </CustomModal>
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default RecentActivity;
=======
export default Budget;
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
