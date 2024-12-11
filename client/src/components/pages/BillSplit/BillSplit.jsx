import React, { useState, useEffect } from 'react';
import Header from '../../../layouts/Header';
import Navbar from '../../../layouts/Navbar';
import BillCard from '../../ui/BillCard';
import { FaHandHoldingUsd } from 'react-icons/fa';
import useAuthStore from '../../../store/useAuthStore';
import CustomModal from '../../modal/CustomModal';

const BillSplit = () => {
  const { user } = useAuthStore();
  const [bills, setBills] = useState([
    {
      title: '',
      date: '',
      amount: '',
      category_id: '',
      description: '',
      splitType: '',
      splitDetails: [{ user_id: '' }],
      category_id: '',
      paid_by: '',
      group_id: '',
    },
  ]);

  const [newBill, setNewBill] = useState({
    title: '',
    date: '',
    amount: '',
    description: '',
    splitType: '',
    splitDetails: [{ user_id: '' }],
    category_id: '',
    paid_by: '',
    group_id: '',
    remainingPercentage: 0,
    remainingAmount: 0,
  });

  const [billSplits, setBillSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [groupID, setGroupID] = useState();
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transaction, setTransaction] = useState({ paidAmount: '' });

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [activeBill, setActiveBill] = useState(null);
  const [splitDetail, setSplitDetail] = useState([]);
  const [userSplitDetail, setUserSplitDetail] = useState([]);

  const handleSettleUp = (bill) => {
    setActiveBill(() => bill);
    setIsTransactionModalOpen(true);
  };

  const handleTransaction = (e) => {
    const { name, value } = e.target;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
    }));

    try {
      const response = await fetch('http://localhost:3000/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('NEW transaction', data);

      if (response.ok) {
        setIsModalOpen(false);
        setTransaction({
          paidAmount: '',
        });
      } else {
        alert('Error submitting transaction');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error submitting new transaction:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newBill.splitType === 'percent' && newBill.remainingPercentage > 0) {
      alert('Please assign all percentages before submitting.');
      return;
    }
    if (newBill.splitType === 'amountOwed' && newBill.remainingAmount > 0) {
      alert('Please assign all amounts before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/groupExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBill),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('NEW GROUP EXPENSE', data);

      if (response.ok) {
        setBills((prevBills) => [...prevBills, newBill]);
        setIsModalOpen(false);
        setNewBill({
          title: '',
          date: '',
          amount: '',
          description: '',
          splitType: '',
          splitDetails: [{ user_id: '' }],
          category_id: '',
          paid_by: '',
          group_id: '',
          remainingPercentage: 0,
          remainingAmount: 0,
        });
      } else {
        alert('Error submitting group expense');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error submitting new group expense:', error);
    }
  };

  useEffect(() => {
    if (activeBill) {
      const filteredSplitDetail = activeBill.splitDetails.find(
        (splitDetail) => splitDetail.user_id._id === user
      );
      setUserSplitDetail(filteredSplitDetail);
      console.log('YEEEET', userSplitDetail);

      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        groupExpense_id: activeBill._id,
      }));

      const fetchSplitData = async () => {
        try {
          const splitDataResponse = await fetch(
            `http://localhost:3000/api/splitPerOneMember/${activeBill._id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }
          );
          const splitData = await splitDataResponse.json();
          setSplitDetail(() => splitData.splitPerMember);
        } catch (error) {
          console.error('Error fetching split detail:', error);
        }
      };
      fetchSplitData();
    }
  }, [activeBill]);

  const handleEdit = (bill) => {
    console.log(`Edit ${bill._id}`);
  };

  const handleDelete = (bill) => {
    console.log(`Delete ${bill._id}`);
  };

  // groups fetch
  useEffect(() => {
    const fetchGroupExpenses = async () => {
      try {
        const groupExpensesResponse = await fetch(
          'http://localhost:3000/api/groupExpense',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        const groupExpenseData = await groupExpensesResponse.json();
        setBillSplits(() => groupExpenseData.groupExpenses);
        setLoading(() => false);
      } catch (error) {
        console.error('Error fetching bill splits:', error);
      }
    };

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

    const fetchCategories = async () => {
      try {
        const categoryResponse = await fetch(
          `http://localhost:3000/api/category`,
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

    fetchGroupExpenses();

    fetchCategories();

    fetchGroups();
  }, []);

  useEffect(() => {
    if (groupID) {
      const fetchMembers = async () => {
        try {
          const groupDetailsResponse = await fetch(
            `http://localhost:3000/api/group/${groupID}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }
          );
          const groupDetails = await groupDetailsResponse.json();

          const memberDetailsPromises = groupDetails.group.members.map(
            async (member) => {
              const userResponse = await fetch(
                `http://localhost:3000/api/userDetail/${member.user_id}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                }
              );
              return await userResponse.json();
            }
          );

          const detailedMembers = await Promise.all(memberDetailsPromises);
          setMembers(detailedMembers);
        } catch (error) {
          console.error('Error fetching members:', error);
        }
      };

      fetchMembers();

      setNewBill({
        title: '',
        date: '',
        amount: '',
        description: '',
        splitType: '',
        splitDetails: [{ user_id: '' }],
        category_id: '',
        paid_by: '',
        group_id: groupID,
        remainingPercentage: 0,
        remainingAmount: 0,
      });
    }
  }, [groupID]);

  // Function to initialize percentages evenly
  const initializeEvenSplit = () => {
    if (newBill.splitType === 'evenly' || newBill.splitType === 'amountOwed') {
      const evenAmount = newBill.amount ? newBill.amount / members.length : 0;
      const initialSplitDetails = members.map((member) => ({
        amountOwed: evenAmount.toFixed(2),
        user_id: member.user._id,
      }));

      setNewBill((prevBill) => ({
        ...prevBill,
        splitDetails: initialSplitDetails,
        remainingPercentage: 0,
        remainingAmount: 0, // Initially, all percentages are assigned
      }));
    }

    if (newBill.splitType === 'percent') {
      const evenPercentage = 100 / members.length;
      const initialSplitDetails = members.map((member) => ({
        user_id: member.user._id,
        percent: evenPercentage.toFixed(0), // Distribute evenly
      }));

      setNewBill((prevBill) => ({
        ...prevBill,
        splitDetails: initialSplitDetails,
        remainingPercentage: 0,
        remainingAmount: 0, // Initially, all percentages are assigned
      }));
    }

    // if (newBill.splitType === 'amountOwed') {
    //   const evenAmount = newBill.amount ? newBill.amount / members.length : 0;
    //   const initialSplitDetails = members.map((member) => ({
    //     user_id: member.user._id,
    //     amountOwed: evenAmount.toFixed(2), // Distribute evenly
    //   }));

    //   setNewBill((prevBill) => ({
    //     ...prevBill,
    //     splitDetails: initialSplitDetails,
    //     remainingPercentage: 0,
    //     remainingAmount: 0, // Initially, all percentages are assigned
    //   }));
    // }
  };

  const handleSplitType = (index, e) => {
    const { name, value } = e.target;
    const updatedSplitDetails = [...newBill.splitDetails];

    if (name === 'percent') {
      const newPercentage = parseFloat(value);

      if (isNaN(newPercentage) || newPercentage < 0) {
        alert('Please enter a valid percentage.');
        return;
      }

      if (!updatedSplitDetails[index]) {
        updatedSplitDetails[index] = {}; // Initialize if undefined
      }

      updatedSplitDetails[index].user_id = members[index].user._id;
      updatedSplitDetails[index].percent = newPercentage;

      const totalAssignedPercentage = updatedSplitDetails.reduce(
        (acc, detail) => acc + (parseFloat(detail.percent) || 0),
        0
      );

      const remainingPercentage = 100 - totalAssignedPercentage;

      setNewBill((prevBill) => ({
        ...prevBill,
        splitDetails: updatedSplitDetails,
        remainingPercentage,
      }));
    }

    if (name === 'amountOwed') {
      const newAmount = parseFloat(value);

      if (isNaN(newAmount) || newAmount < 0) {
        alert('Please enter a valid amount.');
        return;
      }

      if (!updatedSplitDetails[index]) {
        updatedSplitDetails[index] = {}; // Initialize if undefined
      }

      updatedSplitDetails[index].user_id = members[index].user._id;
      updatedSplitDetails[index].amountOwed = newAmount;

      const totalAssignedAmount = updatedSplitDetails.reduce(
        (acc, detail) => acc + (parseFloat(detail.amountOwed) || 0),
        0
      );

      const remainingAmount = newBill.amount - totalAssignedAmount;

      setNewBill((prevBill) => ({
        ...prevBill,
        splitDetails: updatedSplitDetails,
        remainingAmount,
      }));
    }
  };

  // Use Effect to Initialize Even Distribution on Split Type Selection
  useEffect(() => {
    initializeEvenSplit();
  }, [newBill.splitType]);

  const handleGroupChange = (e) => {
    const { value } = e.target;
    setNewBill((prevBill) => ({
      ...prevBill,
      group_id: value,
    }));
    setGroupID(() => value);
  };

  const handlePaidByChange = (e) => {
    const { name, value } = e.target;
    setNewBill((prevBill) => ({
      ...prevBill,
      [name]: value, // Dynamically update the selected value
    }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewBill((prevBill) => ({
      ...prevBill,
      [name]: value, // Dynamically update the selected value
    }));
  };

  const handleBillChange = (e) => {
    const { name, value } = e.target;

    if (name === 'splitType' && value === 'percent') {
      const evenPercentage = 100 / members.length;
      const updatedSplitDetails = members.map((member) => ({
        user_id: member.user._id,
        percent: evenPercentage.toFixed(2),
      }));

      setNewBill((prevBill) => ({
        ...prevBill,
        splitType: value,
        splitDetails: updatedSplitDetails,
      }));
    } else if (
      name === 'splitType' &&
      (value === 'amountOwed' || value === 'evenly')
    ) {
      const evenAmount = newBill.amount / members.length;
      const updatedSplitDetails = members.map((member) => ({
        user_id: member.user._id,
        amountOwed: evenAmount.toFixed(2),
      }));

      setNewBill((prevBill) => ({
        ...prevBill,
        splitType: value,
        splitDetails: updatedSplitDetails,
      }));
    } else {
      setNewBill((prevBill) => ({
        ...prevBill,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>
      <div className="flex flex-col flex-grow">
        <Header />

        <main className="flex-grow p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Bill Split</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add New Bill
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <BillCard
                bills={billSplits}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSettleUp={handleSettleUp}
              />
            </div>
          )}
        </main>
      </div>

      <CustomModal
        title="Add a New Bill"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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

            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                value={newBill.category_id}
                name="category_id"
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option
                  value=""
                  disabled
                >
                  Select a Category
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

            <input
              type="date"
              name="date"
              placeholder="Date"
              value={newBill.date}
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

            {/* Group Selection Dropdown */}
            <div>
              <h3 className="font-semibold">Select Group</h3>
              <select
                name="group_id"
                value={newBill.group_id}
                onChange={handleGroupChange}
                className="w-full p-2 border rounded"
                required
              >
                <option
                  value=""
                  disabled
                >
                  Select a Group
                </option>
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

            {/* Paid By Selection Dropdown */}
            <div>
              <h3 className="font-semibold">Paid By</h3>
              <select
                name="paid_by"
                value={newBill.paid_by}
                onChange={handlePaidByChange}
                className="w-full p-2 border rounded"
                required
              >
                <option
                  value=""
                  disabled
                >
                  Select a Member
                </option>
                {Array.isArray(members) &&
                  members.map((member) => (
                    <option
                      key={member.user._id}
                      value={member.user._id}
                    >
                      {member.user.firstName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-4">
              {newBill.splitType === 'percent' && (
                <div className="mt-4">
                  <h3 className="font-semibold">
                    Remaining Percentage:{' '}
                    {newBill.remainingPercentage.toFixed(2)}%
                  </h3>

                  {newBill.remainingPercentage < 0 && (
                    <p className="text-red-500">
                      Total percentage exceeds 100%. Please adjust.
                    </p>
                  )}
                </div>
              )}

              {newBill.splitType === 'amountOwed' && (
                <div className="mt-4">
                  <h3 className="font-semibold">
                    Remaining Amount: ${newBill.remainingAmount.toFixed(2)}
                  </h3>
                  {newBill.remainingAmount > 0 && (
                    <p className="text-red-500">
                      You need to assign ${newBill.remainingAmount.toFixed(2)}{' '}
                      to the members before saving.
                    </p>
                  )}
                </div>
              )}

              {/* Split Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Split Type
                </label>
                <select
                  name="splitType"
                  value={newBill.splitType}
                  placeholder="Select a split type"
                  onChange={(e) => handleBillChange(e, members)}
                  className="w-full p-2 border rounded mt-1"
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select a Split Type
                  </option>
                  <option value="evenly">Evenly</option>
                  <option value="percent">Percentage</option>
                  <option value="amountOwed">Amount</option>
                </select>
              </div>

              {/* Members Input Fields */}
              <h3 className="font-semibold">Group Members</h3>
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-gray-50 p-2 rounded border"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      name="name"
                      value={
                        `${member.user.firstName} ${member.user.lastName}` || ''
                      }
                      readOnly
                      className="w-full p-2 bg-gray-200 rounded"
                      placeholder="Name"
                    />
                  </div>

                  {newBill.splitType === 'amountOwed' && (
                    <div className="flex-1">
                      <input
                        type="number"
                        name="amountOwed"
                        placeholder="Amount"
                        value={newBill.splitDetails[index]?.amountOwed || 0}
                        onChange={(e) => handleSplitType(index, e)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}

                  {newBill.splitType === 'percent' && (
                    <div className="flex-1">
                      <input
                        type="number"
                        name="percent"
                        placeholder="Percentage"
                        value={newBill.splitDetails[index]?.percent || 0}
                        onChange={(e) => handleSplitType(index, e)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                newBill.remainingPercentage != 0 || newBill.remainingAmount != 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white'
              }`}
              disabled={
                newBill.remainingPercentage != 0 || newBill.remainingAmount != 0
              } // Disable Save if there is remaining percentage
            >
              Save
            </button>
          </div>
        </form>
      </CustomModal>

      <CustomModal
        title="Settle Up"
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      >
        <form
          onSubmit={handleTransfer}
          className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6"
        >
          <div className="space-y-4">
            {activeBill ? (
              <>
                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  {activeBill.title}
                </h2>
                {/* Date */}
                <p className="text-center text-gray-600">
                  <span className="font-semibold">Date:</span>
                  {new Date(activeBill.date).toLocaleDateString('en-US')}
                </p>
                {/* Your Share */}
                <p className="text-center text-lg font-medium text-gray-700">
                  Your Share:{' '}
                  <span className="text-green-600 text-xl font-semibold">
                    {activeBill.splitType === 'percent'
                      ? `$${(
                          (activeBill.amount * userSplitDetail.percent) /
                          100
                        ).toFixed(2)}`
                      : `$${userSplitDetail.amountOwed}`}
                  </span>
                </p>

                {splitDetail.splitPerMember > 0 ? (
                  <>
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <label className="block text-gray-700 text-lg font-medium mb-2">
                        Payment Progress
                      </label>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-500 h-4 rounded-full"
                          style={{
                            width:
                              activeBill.splitType === 'percent'
                                ? `${
                                    ((
                                      activeBill.amount *
                                      (userSplitDetail.percent / 100)
                                    ).toFixed(2) -
                                      splitDetail.splitPerMember) /
                                    (
                                      activeBill.amount *
                                      (userSplitDetail.percent / 100)
                                    ).toFixed(2) /
                                    100
                                  }%`
                                : `${
                                    ((splitDetail.splitPerMember -
                                      userSplitDetail.amountOwed) /
                                      userSplitDetail.amountOwed) *
                                    100
                                  }%`, // Calculate width based on amount owed
                          }}
                        ></div>
                      </div>
                      <p className="text-right text-sm text-gray-500 mt-1">
                        Paid: $
                        {activeBill.splitType === 'percent'
                          ? `${
                              splitDetail.splitPerMember -
                              (
                                activeBill.amount *
                                (userSplitDetail.percent / 100)
                              ).toFixed(2)
                            }/ ${(
                              (activeBill.amount * userSplitDetail.percent) /
                              100
                            ).toFixed(2)}`
                          : `${
                              splitDetail.splitPerMember -
                              userSplitDetail.amountOwed
                            }/ ${userSplitDetail.amountOwed}`}
                      </p>
                    </div>
                    {/* Input Section */}
                    <div>
                      <label className="block text-gray-700 text-lg font-medium mb-2">
                        Pay Amount:
                      </label>
                      <input
                        type="number"
                        name="paidAmount"
                        placeholder={`Enter amount`}
                        value={transaction.paidAmount}
                        onChange={(e) => {
                          if (
                            parseFloat(e.target.value) <=
                            splitDetail.splitPerMember
                          ) {
                            handleTransaction(e); // Only allow changes if the input is within limits
                          }
                        }}
                        max={splitDetail.splitPerMember}
                        className="w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                        required
                      />
                    </div>
                    {/* Notes Section */}
                    <div>
                      <label className="block text-gray-700 text-lg font-medium mb-2">
                        Add a Note:
                      </label>
                      <textarea
                        name="remarks"
                        value={transaction.remarks}
                        onChange={handleTransaction}
                        rows="3"
                        placeholder="Write a note about this payment..."
                        className="w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
                        required
                      ></textarea>
                    </div>
                    {/* Action Button */}
                    <div className="flex flex-col items-center space-y-4 pt-6 border-t border-gray-300 mt-6">
                      <button
                        type="submit"
                        className="flex items-center justify-center w-full py-3 px-5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                        aria-label="Settle Up"
                      >
                        <FaHandHoldingUsd className="mr-2 text-xl" />
                        <span className="text-lg font-medium">Settle Up</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-center text-2xl">
                      You are owed ${Math.abs(splitDetail.splitPerMember)}
                    </h3>
                  </>
                )}
              </>
            ) : (
              <div>No Active Bill Data</div>
            )}
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default BillSplit;
