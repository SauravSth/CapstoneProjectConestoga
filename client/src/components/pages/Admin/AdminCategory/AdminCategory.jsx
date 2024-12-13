import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Navbar from '../../../../layouts/Navbar';
import Header from '../../../../layouts/Header';
import CustomTable from '../../../table/CustomTable';
import CustomModal from '../../../modal/CustomModal';
import axios from 'axios';

import { FaCheck } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';

const AdminCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    imagePath: '',
  });

  const [editedData, setEditedData] = React.useState({
    name: '',
    imagePath: '',
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
    const fetchCategoryList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/category`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        const result = await response.json();
        setCategoryList(
          Array.isArray(result.categories) ? result.categories : []
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryList();
  }, []);

  const handleNewCategory = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!newCategory.name || !newCategory.imagePath) {
      alert('Please provide both a name and an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newCategory.name); // Add the name
    formData.append('image', newCategory.imagePath); // Add the file

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/category`,
        {
          method: 'POST',
          body: formData, // Use FormData
          credentials: 'include', // Include cookies for authentication
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Category updated successfully:', data);

        setCategoryList((prevData) => {
          // Update the category list with the new data
          const updatedData = prevData.map((category) =>
            category._id === data._id ? data : category
          );
          return updatedData;
        });

        closeModal();
        resetFormFields();
      } else {
        alert('Error updating category');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const resetFormFields = () => {
    setNewCategory({
      name: '',
      imagePath: '',
    });

    setEditedData({
      name: '',
      imagePath: '',
    });
  };

  const handleEdit = (existingData) => {
    console.log(existingData);
    setEditModalOpen(true);
    setEditedData(existingData);
  };

  const handleEditFormSubmit = async () => {
    try {
      console.log('EditedData:', editedData);

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/category/${
          editedData._id
        }`,
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

        // Update the categoryList state by replacing the edited user
        setCategoryList((prevData) => {
          const updatedData = prevData.map((category) =>
            category._id === editedData._id ? editedData : category
          );
          return updatedData;
        });

        closeModal();
        resetFormFields();
      } else {
        alert('Error editing cateogry');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleDelete = async (existingData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/category`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: existingData._id }),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Category Deleted:', existingData);

        // Update the usersList state directly
        setCategoryList((prevData) =>
          prevData.map((category) =>
            category._id === existingData._id
              ? { ...existingData, isActive: false }
              : category
          )
        );

        alert('Category successfully deleted.');
      } else {
        alert('Error deleting category');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error during delete operation:', error);
      alert('Something went wrong while deleting the user.');
    }
  };

  const columns = [
    {
      field: 'imagePath',
      headerName: 'Icon',
      render: (row) => (
        <img
          src={`${
            import.meta.env.VITE_REACT_APP_SERVER_URL
          }/${row.imagePath.replace('public\\', '')}`}
          alt={row.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ),
    },
    { field: 'name', headerName: 'Category Title' },
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
        <Header title="Admin Categories" />

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between mt-4 max-w-full">
            <div className="flex items-center space-x-8 w-full">
              <div className="flex items-center space-x-4 ml-auto">
                <button
                  className="w-[150px] px-4 py-2 text-white bg-green-600 rounded-lg focus:outline-none hover:bg-green-700"
                  onClick={handleNewCategory}
                >
                  + New Category
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
                data={categoryList}
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

        {/* <CustomModal
          title="Add New Category"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                required
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Upload Image</label>
              <input
                type="file"
                accept=".jpg,.png,.svg"
                onChange={(e) =>
                  setNewCategory((prevData) => ({
                    ...prevData,
                    imagePath: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
        </CustomModal> */}

        <CustomModal
          title="Add New Category"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                required
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Upload Image</label>
              <input
                type="file"
                accept=".jpg,.png,.svg"
                onChange={(e) =>
                  setNewCategory((prevData) => ({
                    ...prevData,
                    imagePath: e.target.files[0], // Store the selected file
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
          title="Edit Category"
          isOpen={isEditModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                required
                value={editedData.name}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
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

export default AdminCategory;
