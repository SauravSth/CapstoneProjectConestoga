import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import CustomModal from '../../modal/CustomModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExpensePDF from '../../pdfs/expensePDF.jsx';

const AllExpenses = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
    { field: 'title', headerName: 'Expense Title' },
    { field: 'category', headerName: 'Category' },
    { field: 'date', headerName: 'Date' },
    { field: 'amount', headerName: 'Amount' },
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

  // Handle pagination
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Get paginated data
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNewExpense = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (existingData) => {
    console.log(existingData);
    setEditModalOpen(true);
    setEditedData(existingData);
  };

  const handleDelete = async (existingData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/expense/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: existingData._id }),
          credentials: 'include',
        }
      );

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

  const handleEditFormSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/expense/${
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

      const updatedExpense = await response.json();

      if (response.ok) {
        setData((prevData) => {
          const updatedData = prevData.map((item) =>
            item._id === updatedExpense._id ? updatedExpense : item
          );
          setFilteredData(updatedData);
          return updatedData;
        });

        alert('Expense successfully updated');
        closeModal();
        resetFormFields();
      } else {
        console.error('Error editing expense:', updatedExpense);
        alert('Error editing expense');
      }
    } catch (error) {
      console.error('Error during edit operation:', error);
      alert('Something went wrong while editing the expense.');
    }
  };

  const handleFormSubmit = async () => {
    if (!expenseName || !category || !amount) {
      alert('Please fill out all fields');
      return;
    }
    try {
      const newExpense = {
        title: expenseName,
        date: expenseDate,
        amount: Number(amount),
        category_id: category,
      };

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/expense`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExpense),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok) {
        const formattedExpense = {
          ...data.newExpense,
          category:
            categories.find((cat) => cat._id === category)?.name ||
            'Unknown Category',
          date: new Date(data.newExpense.date).toLocaleDateString('en-US'),
        };

        setData((prevData) => {
          const updatedData = [...prevData, formattedExpense];
          setFilteredData(updatedData);
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
    setExpenseName('');
    setCategory('');
    setExpenseDate('');
    setAmount('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditModalOpen(false);
    resetFormFields();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = data.filter(
      (expense) =>
        expense.title.toLowerCase().includes(value.toLowerCase()) ||
        expense.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const expenseResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/expense`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!expenseResponse.ok) {
          throw new Error(`HTTP error! Status: ${expenseResponse.status}`);
        }

        const expenseData = await expenseResponse.json();
        const formattedData = expenseData.expenses.map((expense) => ({
          ...expense,
          category: expense.category_id?.name || 'Unknown Category',
          date: new Date(expense.date).toLocaleDateString('en-US'),
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/category`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="All Expenses" />

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between mt-4 max-w-full">
            <div className="flex items-center space-x-8 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title or category"
                className="w-[400px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Right Section: New Expense and Download PDF */}
            <div className="flex items-center space-x-4 ml-auto">
              <button
                className="w-[150px] px-4 py-2 text-white bg-green-600 rounded-lg focus:outline-none hover:bg-green-700"
                onClick={handleNewExpense}
              >
                + New Expense
              </button>
              <PDFDownloadLink
                document={<ExpensePDF data={filteredData} />}
                fileName="Expenses_Report.pdf"
                className="w-[200px] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none"
              >
                {({ loading }) =>
                  loading ? 'Generating PDF...' : 'Download PDF Report'
                }
              </PDFDownloadLink>
            </div>
          </div>

          {/* Expense Table or Card View */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <CustomTable
                columns={columns}
                data={paginatedData}
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

        {/* Add New Expense Modal */}
        <CustomModal
          title="Add New Expense"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Expense Title</label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Expense Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option
                  value={''}
                  disabled
                >
                  -- Select a Category --
                </option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
          title="Edit Expense"
          isOpen={isEditModalOpen}
          onClose={closeModal}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700">Expense Title</label>
              <input
                type="text"
                required
                value={editedData.title}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    title: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Expense Date</label>
              <input
                type="date"
                required
                value={editedData.date}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    date: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                value={editedData?.category_id?._id}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    category_id: e.target.value,
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
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                required
                type="number"
                value={editedData.amount}
                onChange={(e) =>
                  setEditedData((prevData) => ({
                    ...prevData,
                    amount: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
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

export default AllExpenses;
