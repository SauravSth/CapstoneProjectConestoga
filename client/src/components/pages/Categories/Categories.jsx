import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import { GoDotFill } from 'react-icons/go';
import { FaEdit, FaTrash, FaSave, FaPlus } from 'react-icons/fa';

const Categories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
<<<<<<< HEAD
  const [editRowId, setEditRowId] = useState(null); // Track the row being edited
  const [editCategoryName, setEditCategoryName] = useState(''); // Track the edited category name
=======
  const [editRowId, setEditRowId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9

  const columns = [
    {
      field: 'name',
      headerName: 'Category',
      render: (rowData) =>
        editRowId === rowData._id ? (
          <input
            type="text"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            className="p-1 border border-gray-300 rounded w-full"
          />
        ) : (
          rowData.name
        ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      render: (rowData) => (
        <select
          value={rowData.isActive ? 'Active' : 'Inactive'}
          onChange={(e) => handleStatusChange(rowData, e.target.value)}
          className="p-1 bg-white border border-gray-300 rounded"
        >
<<<<<<< HEAD
          <option value="Active">
            <GoDotFill />
            Active
          </option>
          <option value="Inactive">
            <GoDotFill />
            Inactive
          </option>
=======
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
        </select>
      ),
    },
    {
      field: '_id',
      headerName: 'Action',
      render: (rowData) => (
        <div className="flex space-x-2">
          {editRowId === rowData._id ? (
            <button
              onClick={() => handleSaveEdit(rowData._id)}
              className="text-green-500 hover:text-green-700"
            >
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => handleEdit(rowData)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          )}
          <button
            onClick={() => handleDelete(rowData)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/category', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        setData(Array.isArray(result.categories) ? result.categories : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (rowData, newStatus) => {
    const updatedStatus = newStatus === 'Active';
    try {
      await fetch(`http://localhost:3000/api/category/${rowData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      setData((prevData) =>
        prevData.map((item) =>
          item._id === rowData._id ? { ...item, isActive: updatedStatus } : item
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleEdit = (rowData) => {
    setEditRowId(rowData._id);
    setEditCategoryName(rowData.name);
  };

  const handleSaveEdit = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/category/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, name: editCategoryName }),
      });
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, name: editCategoryName } : item
        )
      );
      setEditRowId(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('Failed to save edited category:', error);
    }
  };

  const handleDelete = async (rowData) => {
    try {
<<<<<<< HEAD
      await fetch(`http://localhost:3000/api/category/`, {
        method: 'DELETE', // Use DELETE method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: rowData._id }),
=======
      await fetch(`http://localhost:3000/api/category`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: rowData._id }),
>>>>>>> 3e6bac7d5918cc7f6c6dbb0b1141acee3d62dae9
      });
      setData((prevData) =>
        prevData.filter((item) => item._id !== rowData._id)
      );
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleAddNewCategory = () => {
    setIsAddingNew(true);
  };

  const handleSaveNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      name: newCategoryName,
      status: false, // default to inactive
    };

    try {
      const response = await fetch('http://localhost:3000/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      const savedCategory = await response.json();
      setData([savedCategory, ...data]);
      setIsAddingNew(false);
      setNewCategoryName('');
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleCancelNewCategory = () => {
    setIsAddingNew(false);
    setNewCategoryName('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="Categories" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>

          <button
            onClick={handleAddNewCategory}
            className="ml-4 px-4 py-2 text-black rounded-lg focus:outline-none"
            style={{
              backgroundColor: '#80C028',
              opacity: '0.45',
            }}
          >
            <FaPlus className="inline mr-2" /> New Category
          </button>

          {isAddingNew && (
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
          )}

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

export default Categories;
