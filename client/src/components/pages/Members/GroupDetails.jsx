import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';
import useAuthStore from '../../../store/useAuthStore.js';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { field: 'groupName', headerName: 'Group Name' },
    { field: 'memberCount', headerName: 'Members' },
    { field: 'totalAmount', headerName: 'Total Amount' },
    { field: 'expenseTitle', headerName: 'Expense Title' },
    { field: 'date', headerName: 'Date' },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = data.filter(
      (expense) =>
        expense.groupName.toLowerCase().includes(value.toLowerCase()) ||
        expense.expenseTitle.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const groupResponse = await fetch(
          `http://localhost:3000/api/group/${id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!groupResponse.ok) {
          throw new Error(`HTTP error! Status: ${groupResponse.status}`);
        }

        const groupData = await groupResponse.json();
        const formattedData = groupData.expenses.map((expense) => ({
          groupName: expense.groupName,
          memberCount: expense.members.length, // Assuming 'members' is an array
          totalAmount: expense.totalAmount,
          expenseTitle: expense.title,
          date: new Date(expense.date).toLocaleDateString('en-US'),
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching group expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="Group Details" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">Group Expenses</div>
          <div className="text-gray-500">
            Track your group expenses and manage finances.
          </div>

          <div className="flex items-center justify-between mt-4 max-w-full">
            <div className="flex items-center space-x-4 max-w-lg">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by group or expense title"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none">
                Filter by Date
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <CustomTable
              columns={columns}
              data={filteredData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default GroupDetails;
