import React, { useState } from 'react';
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

  const [totalWithTip, setTotalWithTip] = useState(0);
  const [splitAmount, setSplitAmount] = useState(0);

  const handleNewBudget = () => {
    setIsModalOpen(true);
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

            {/* Members Section */}
            <div>
              <h3 className="font-semibold">Members</h3>
              {newBill.members.map((member, index) => (
                <div
                  key={index}
                  className="space-y-2"
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
                  {newBill.splitMethod !== 'equal' && ( // Conditionally render amountOwed
                    <input
                      type="number"
                      name="amountOwed"
                      value={member.amountOwed}
                      onChange={(e) => handleMemberChange(index, e)}
                      placeholder="Amount Owed"
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
