import React, { useState, useEffect } from 'react';
import useBillSplitStore from '../../../store/useBillSpiltStore';
import Header from '../../../layouts/Header';
import Navbar from '../../../layouts/Navbar';
import BillCard from '../../ui/BillCard';
import CustomModal from '../../modal/CustomModal';

const BillSplit = () => {
  const currentUser = {
    name: 'Piyush',
    email: 'piyush@mdhr.com',
    amountOwned: 0,
  };
  const [groups, setGroups] = useState([]);
  const [bills, setBills] = useState([
    {
      id: 1,
      title: 'Grocery Shopping',
      description: 'Trip to T&T Supermarket',
      createdAt: 'August 28, 2022',
      amount: 200,
      remainingAmount: 30,
      members: [
        { name: 'John Doe', email: 'john@example.com', amountOwed: 100 },
        {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          amountOwed: 70,
        },
      ],
    },
    {
      id: 2,
      title: 'Dinner Outing',
      description: 'Dinner at Olive Garden',
      createdAt: 'September 1, 2022',
      amount: 150,
      remainingAmount: 25,
      members: [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          amountOwed: 75,
        },
        { name: 'Bob Brown', email: 'bob@example.com', amountOwed: 50 },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    title: '',
    description: '',
    amount: '',
    splitMethod: 'equal', // New field to store the split method
    members: [
      {
        name: currentUser.name, // Include current user
        email: currentUser.email, // Include current user
        amountOwed: currentUser.amountOwned,
      },
    ],
  });

  const {
    totalBill,
    tipPercentage,
    numberOfPeople,
    setTotalBill,
    setTipPercentage,
    setNumberOfPeople,
  } = useBillSplitStore();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupResponse = await fetch(`http://localhost:3000/api/group`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const groupData = await groupResponse.json();
        setGroups(groupData.groups);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchGroups();
  }, []);

  const [totalWithTip, setTotalWithTip] = useState(0);
  const [splitAmount, setSplitAmount] = useState(0);

  const handleNewBudget = () => {
    setIsModalOpen(true);
    fetchGroups();
  };

  const handleBillChange = (e) => {
    const { name, value } = e.target;
    setNewBill((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMembers = [...newBill.members];
    updatedMembers[index][name] = value;
    setNewBill((prevState) => ({
      ...prevState,
      members: updatedMembers,
    }));
  };

  const handleGroupChange = async (e) => {
    const groupId = e.target.value;

    // Update the newBill state with the selected group ID
    setNewBill((prev) => ({
      ...prev,
      group: groupId, // Store the selected group ID
      members: [], // Clear the previous members
    }));

    if (groupId) {
      try {
        // Fetch the group details including members based on the selected group ID
        const response = await fetch(
          `http://localhost:3000/api/group/${groupId}`
        );
        const data = await response.json();

        // Assuming the response contains an array of members
        setNewBill((prev) => ({
          ...prev,
          members: data.members, // Set the members of the selected group
        }));
      } catch (error) {
        console.error('Error fetching group details:', error);
        alert('Failed to fetch group details');
      }
    }
  };

  const handleAddMember = () => {
    setNewBill((prevState) => ({
      ...prevState,
      members: [...prevState.members, { name: '', email: '', amountOwed: 0 }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle the calculation for the amount owed based on the selected split method
    const updatedMembers = newBill.members.map((member) => {
      if (newBill.splitMethod === 'equal') {
        // Split equally among all members
        return {
          ...member,
          amountOwed: newBill.amount / newBill.members.length,
        };
      } else if (newBill.splitMethod === 'percentage') {
        // Split based on user input (percentage)
        const amountOwed = (newBill.amount * member.amountOwed) / 100;
        return {
          ...member,
          amountOwed,
        };
      } else if (newBill.splitMethod === 'specific') {
        // Use specific amounts for each member
        return {
          ...member,
          amountOwed: member.amountOwed || 0,
        };
      }
      return member;
    });

    const newBillData = {
      ...newBill,
      id: Date.now(), // Assigning a unique ID to the new bill
      createdAt: new Date().toLocaleDateString(),
      remainingAmount: newBill.amount,
      members: updatedMembers,
    };

    setBills((prevBills) => [...prevBills, newBillData]);
    setIsModalOpen(false);
    setNewBill({
      title: '',
      description: '',
      amount: '',
      splitMethod: 'equal',
      members: [
        {
          name: currentUser.name, // Reset current user
          email: currentUser.email, // Reset current user
          amountOwed: currentUser.amountOwned,
        },
      ],
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="Bill Split" />

        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">Bill Split</div>
          <div className="text-gray-500">Start splitting your bills</div>

          {/* Search, Filter, and New Budget */}
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
              onClick={handleNewBudget}
            >
              + Add Bill
            </button>
          </div>

          {/* Bill Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bills.map((bill) => (
              <BillCard
                key={bill.id}
                name={bill.title}
                category={bill.description}
                date={bill.createdAt}
                totalAmount={bill.amount}
                remainingAmount={bill.remainingAmount}
                members={bill.members}
                onEdit={() => console.log(`Editing bill ID: ${bill.id}`)}
                onDelete={() => console.log(`Deleting bill ID: ${bill.id}`)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Modal for adding new bill */}
      <CustomModal
        title="Add a New Bill"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Group Selection Dropdown */}
            <div>
              <h3 className="font-semibold">Select Group</h3>
              <select
                name="group"
                value={newBill.group}
                onChange={handleGroupChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a Group</option>
                {/* {Array.isArray(groupData.groups) &&
                  groupData.groups.map((group) => (
                    <option
                      key={group._id}
                      value={group._id}
                    >
                      {group.name}
                    </option>
                  ))} */}

                {Array.isArray(groups) &&
                  groups.map((group) => (
                    <option
                      key={group._id}
                      value={group._id}
                    >
                      {group.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Bill Title and Description */}
            <input
              type="text"
              name="title"
              placeholder="Bill Title"
              value={newBill.title}
              onChange={handleBillChange}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newBill.description}
              onChange={handleBillChange}
              className="w-full p-2 border rounded"
              required
            />

            {/* Total Amount */}
            <input
              type="number"
              name="amount"
              placeholder="Total Amount"
              value={newBill.amount}
              onChange={handleBillChange}
              className="w-full p-2 border rounded"
              required
            />

            {/* Split Method Selection */}
            <div>
              <h3 className="font-semibold">Select Split Method</h3>
              <select
                name="splitMethod"
                value={newBill.splitMethod}
                onChange={handleBillChange}
                className="w-full p-2 border rounded"
              >
                <option value="equal">Equally</option>
                <option value="percentage">By Percentage</option>
                <option value="specific">By Amount</option>
              </select>
            </div>

            {/* Members and Split Amount Display */}
            {newBill.group && (
              <div className="flex space-x-8">
                <div className="flex-1">
                  <h3 className="font-semibold">Members</h3>
                  {newBill.members.map((member, index) => (
                    <div
                      key={index}
                      className="space-y-2 mb-4"
                    >
                      <input
                        type="text"
                        name="name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, e)}
                        placeholder="Member Name"
                        className="w-full p-2 border rounded"
                        readOnly={member.name === currentUser.name} // Make current user readonly
                      />
                      <input
                        type="email"
                        name="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, e)}
                        placeholder="Member Email"
                        className="w-full p-2 border rounded"
                        readOnly={member.email === currentUser.email} // Make current user readonly
                      />
                      {newBill.splitMethod !== 'equal' && (
                        <input
                          type="number"
                          name="amountOwed"
                          value={member.amountOwed}
                          onChange={(e) => handleMemberChange(index, e)}
                          placeholder={
                            newBill.splitMethod === 'percentage'
                              ? 'Percentage Owed'
                              : 'Amount Owed'
                          }
                          className="w-full p-2 border rounded"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="text-blue-500"
                  >
                    + Add Member
                  </button>
                </div>

                {/* Split Method Display */}
                <div className="flex-1">
                  <h3 className="font-semibold">Split Information</h3>
                  <div className="space-y-2">
                    {newBill.splitMethod === 'equal' ? (
                      <p>
                        Each member owes an equal share of $
                        {newBill.amount / newBill.members.length}
                      </p>
                    ) : newBill.splitMethod === 'percentage' ? (
                      newBill.members.map((member, index) => (
                        <p key={index}>
                          {member.name} owes {member.amountOwed}% of the total
                          bill
                        </p>
                      ))
                    ) : (
                      newBill.members.map((member, index) => (
                        <p key={index}>
                          {member.name} owes ${member.amountOwed} of the total
                          bill
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default BillSplit;
