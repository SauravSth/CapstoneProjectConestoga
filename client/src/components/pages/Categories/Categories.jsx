import React, { useEffect, useState } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import { GoDotFill } from 'react-icons/go';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Categories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: 'name', headerName: 'Category' },
    // { field: 'email', headerName: 'Email' },
    {
      field: 'status',
      headerName: 'Status',
      render: (rowData) => (
        <select
          value={rowData.status ? 'Active' : 'Inactive'}
          onChange={(e) => handleStatusChange(rowData, e.target.value)}
          className="p-1 bg-white border border-gray-300 rounded"
        >
          <option value="Active">
            <GoDotFill />
            Active
          </option>
          <option value="Inactive">
            <GoDotFill />
            Inactive
          </option>
        </select>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      render: (rowData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(rowData)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
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

  // Fetch categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/category');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle status change
  const handleStatusChange = async (rowData, newStatus) => {
    const updatedStatus = newStatus === 'Active';
    try {
      await fetch(`http://localhost:3000/api/category/${rowData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updatedStatus }),
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === rowData.id ? { ...item, status: updatedStatus } : item
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Handle edit action
  const handleEdit = (rowData) => {
    console.log('Edit clicked for:', rowData);
    // Add edit logic here
  };

  // Handle delete action
  const handleDelete = async (rowData) => {
    try {
      await fetch(`http://localhost:3000/api/category/${rowData.id}`, {
        method: 'DELETE',
      });
      setData((prevData) => prevData.filter((item) => item.id !== rowData.id));
    } catch (error) {
      console.error('Failed to delete item:', error);
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
        <Header title="Categories" />

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>

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
