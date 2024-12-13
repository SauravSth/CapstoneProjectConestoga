import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Navbar from '../../../../layouts/Navbar';
import Header from '../../../../layouts/Header';
import CustomTable from '../../../table/CustomTable';
import CustomModal from '../../../modal/CustomModal';

const AdminUser = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const result = await response.json();
        setUsersList(Array.isArray(result.users) ? result.users : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersList();
  }, []);

  const columns = [
    { field: 'firstName', headerName: 'First Name' },
    { field: 'lastName', headerName: 'Last Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'isVerified', headerName: 'Is Verified' },
    { field: 'isActive', headerName: 'Is Active' },
    {
      field: 'actions',
      headerName: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (existingData) => {
    console.log(existingData);
    setEditModalOpen(true);
    setEditedData(existingData);
  };

  const handleDelete = async (existingData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: existingData._id }),
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the deleted expense from the state
        setData((prevData) => {
          const updatedData = prevData.filter(
            (item) => item._id !== existingData._id
          );
          setFilteredData(updatedData); // Update filtered data if necessary
          return updatedData;
        });

        alert('Expense successfully deleted');
      } else {
        const errorText = await response.text(); // Retrieve detailed error message
        console.error('Error deleting expense:', errorText);
        alert('Error deleting expense');
      }
    } catch (error) {
      console.error('Error during delete operation:', error);
      alert('Something went wrong while deleting the expense.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>
      <div className="flex flex-col flex-grow">
        <Header title="Admin Users" />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between mt-4 max-w-full">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <CustomTable
                columns={columns}
                data={usersList}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUser;
