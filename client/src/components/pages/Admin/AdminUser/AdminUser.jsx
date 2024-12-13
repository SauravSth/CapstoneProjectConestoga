import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Navbar from '../../../../layouts/Navbar';
import Header from '../../../../layouts/Header';
import CustomTable from '../../../table/CustomTable';
import CustomModal from '../../../modal/CustomModal';

import { FaCheck } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';

const AdminUser = () => {
  const [usersList, setUsersList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newUser, setNewUser] = React.useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: '',
    isVerified: false,
    isActive: false,
  });

  const [editedData, setEditedData] = React.useState({
    username: '',
    firstName: '',
    lastName: '',
    userType: '',
    isVerified: false,
    isActive: false,
  });

  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Handle pagination
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Get paginated data
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditModalOpen(false);
    resetFormFields();
  };

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

  const handleNewUser = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      console.log(newUser);

      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OK');

        setUsersList((prevData) => {
          const updatedData = [...prevData, newUser];
          return updatedData;
        });

        closeModal();
        resetFormFields();
      } else {
        alert('Error submitting expense');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error submitting new expense:', error);
    }
  };

  const resetFormFields = () => {
    setNewUser({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userType: '',
      isVerified: false,
      isActive: false,
    });

    setEditedData({
      username: '',
      firstName: '',
      lastName: '',
      userType: '',
      isVerified: false,
      isActive: false,
    });
  };

  const handleEdit = (existingData) => {
    console.log(existingData);
    setEditModalOpen(true);
    setEditedData(existingData);
  };

  const handleEditFormSubmit = async () => {
    try {
      console.log('EditdData', editedData);

      const response = await fetch(
        `http://localhost:3000/api/user/${editedData._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedData),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('OK');

        setUsersList((prevData) => {
          const updatedData = [...prevData, editedData];
          console.log(updatedData);
          return updatedData;
        });
        closeModal();
        resetFormFields();
      } else {
        alert('Error submitting expense');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error submitting new expense:', error);
    }
  };

  const handleDelete = async (existingData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user`, {
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

  const columns = [
    { field: 'firstName', headerName: 'First Name' },
    { field: 'lastName', headerName: 'Last Name' },
    { field: 'email', headerName: 'Email' },
    {
      field: 'isVerified',
      headerName: 'Is Verified',
      render: (row) => (row.isVerified ? <FaCheck /> : <ImCross />),
    },
    {
      field: 'isActive',
      headerName: 'Is Active',
      render: (row) => (row.isActive ? <FaCheck /> : <ImCross />),
    },
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

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="Admin Users" />

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between mt-4 max-w-full">
            <div className="flex items-center space-x-8 w-full">
              <div className="flex items-center space-x-4 ml-auto">
                <button
                  className="w-[150px] px-4 py-2 text-white bg-green-600 rounded-lg focus:outline-none hover:bg-green-700"
                  onClick={handleNewUser}
                >
                  + New User
                </button>

                {/* <PDFDownloadLink
                  document={<ExpensePDF data={filteredData} />}
                  fileName="Expenses_Report.pdf"
                  className="w-[200px] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none"
                >
                  {({ loading }) =>
                    loading ? 'Generating PDF...' : 'Download PDF Report'
                  }
                </PDFDownloadLink> */}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <CustomTable
                columns={columns}
                data={usersList}
              />
              <ReactPaginate
                previousLabel={'← Previous'}
                nextLabel={'Next →'}
                pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                onPageChange={handlePageChange}
                containerClassName={
                  'flex justify-center items-center space-x-2 mt-4 '
                }
                activeClassName={
                  'py-1.5 text-gray-600 bg-green-600 font-bold rounded-md'
                }
                disabledClassName={'text-red-800 cursor-not-allowed'}
                pageLinkClassName={
                  'px-3 py-2 border border-gray-300 text-gray-200 bg-blue-600 rounded-md hover:bg-green-600 transition duration-150 ease-in-out'
                }
                previousLinkClassName={
                  'px-3 py-2 border border-gray-300 rounded-md bg-blue-600 hover:bg-green-600 transition duration-150 ease-in-out'
                }
                nextLinkClassName={
                  'px-3 py-2 border border-gray-300 bg-blue-600 rounded-md hover:bg-green-600 transition duration-150 ease-in-out'
                }
                breakLabel={'...'}
                breakClassName={'px-3 py-2 border border-gray-300 rounded-md'}
              />
            </>
          )}
        </main>

        <CustomModal
          title="Add New User"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                required
                value={newUser.username}
                onChange={(e) =>
                  setNewUser((prevData) => ({
                    ...prevData,
                    username: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                required
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser((prevData) => ({
                    ...prevData,
                    firstName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                required
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser((prevData) => ({
                    ...prevData,
                    lastName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                required
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                required
                disabled
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prevData) => ({
                    ...prevData,
                    password: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">User Type</label>
              <select
                value={newUser.userType}
                onChange={(e) =>
                  setNewUser((prevData) => ({
                    ...prevData,
                    userType: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option
                  value={''}
                  disabled
                >
                  -- Select a Category --
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Verified</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newUser.isVerified}
                  onChange={(e) =>
                    setNewUser((prevData) => ({
                      ...prevData,
                      isVerified: e.target.checked,
                    }))
                  }
                  className="hidden"
                  id="toggleIsVerified"
                />
                <label
                  htmlFor="toggleIsVerified"
                  className={`cursor-pointer w-12 h-6 rounded-full ${
                    newUser.isVerified ? 'bg-green-500' : 'bg-gray-300'
                  } relative`}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      newUser.isVerified ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
                <span className="ml-2 text-gray-700">
                  {newUser.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Active</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newUser.isActive}
                  onChange={(e) =>
                    setNewUser((prevData) => ({
                      ...prevData,
                      isActive: e.target.checked,
                    }))
                  }
                  className="hidden"
                  id="toggleisActive"
                />
                <label
                  htmlFor="toggleisActive"
                  className={`cursor-pointer w-12 h-6 rounded-full ${
                    newUser.isActive ? 'bg-green-500' : 'bg-gray-300'
                  } relative`}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      newUser.isActive ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
                <span className="ml-2 text-gray-700">
                  {newUser.isActive ? 'Active' : 'Not Active'}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
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
                Submit
              </button>
            </div>
          </form>
        </CustomModal>

        <CustomModal
          title="Edit User"
          isOpen={isEditModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                required
                disabled
                value={editedData.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                required
                disabled
                value={'No Can See'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                required
                value={editedData.username}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    username: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                required
                value={editedData.firstName}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    firstName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                required
                value={editedData.lastName}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    lastName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">User Type</label>
              <select
                value={editedData.userType}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    userType: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option
                  value={''}
                  disabled
                >
                  -- Select a Category --
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Verified</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedData.isVerified}
                  onChange={(e) =>
                    setEditedData((prevData) => ({
                      ...prevData,
                      isVerified: e.target.checked,
                    }))
                  }
                  className="hidden"
                  id="toggleIsVerified"
                />
                <label
                  htmlFor="toggleIsVerified"
                  className={`cursor-pointer w-12 h-6 rounded-full ${
                    editedData.isVerified ? 'bg-green-500' : 'bg-gray-300'
                  } relative`}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      editedData.isVerified ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
                <span className="ml-2 text-gray-700">
                  {editedData.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Active</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedData.isActive}
                  onChange={(e) =>
                    setEditedData((prevData) => ({
                      ...prevData,
                      isActive: e.target.checked,
                    }))
                  }
                  className="hidden"
                  id="toggleisActive"
                />
                <label
                  htmlFor="toggleisActive"
                  className={`cursor-pointer w-12 h-6 rounded-full ${
                    editedData.isActive ? 'bg-green-500' : 'bg-gray-300'
                  } relative`}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      editedData.isActive ? 'transform translate-x-6' : ''
                    }`}
                  ></span>
                </label>
                <span className="ml-2 text-gray-700">
                  {editedData.isActive ? 'Active' : 'Not Active'}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
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
                onClick={handleEditFormSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </CustomModal>
      </div>
    </div>
  );
};

export default AdminUser;
