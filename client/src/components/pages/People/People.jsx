import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import { GoDotFill } from 'react-icons/go';
import { FaEdit, FaTrash, FaSave, FaPlus } from 'react-icons/fa';
import CustomTable from '../../table/CustomTable';
import useAuthStore from '../../../store/useAuthStore.js';

const People = () => {
  const [loading, setLoading] = useState(true);

  const handleAddNewPerson = () => {};
  const columns = [
    {
      asdsa: 'asdasd',
      asdfasf: 'asdasfas',
    },
    { asdsa: 'asdasd', asdfasf: 'asdasfas' },
  ];

  const data = [
    {
      asdsa: 'asdasd',
      asdfasf: 'asdasfas',
    },
    { asdsa: 'asdasd', asdfasf: 'asdasfas' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="Groups" />

        <main className="p-6 space-y-6">
          {/* <div className="text-5xl font-bold">My Wallet</div> */}
          {/* <div className="text-gray-500">Keep track of your financial plan</div> */}
          <button
            onClick={handleAddNewPerson}
            className="ml-4 px-4 py-2 text-black rounded-lg focus:outline-none"
            style={{
              backgroundColor: '#80C028',
              opacity: '0.45',
            }}
          >
            <FaPlus className="inline mr-2" /> Add Person
          </button>

          {/* {isAddingNew && (
            <div className="flex items-center space-x-4 p-4 bg-white border rounded shadow">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="flex-grow p-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleSaveNewCategory}
                className="text-green-500 hover:text-green-700"
              >
                <FaSave />
              </button>
              <button
                onClick={handleCancelNewCategory}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          )} */}

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={data}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default People;
