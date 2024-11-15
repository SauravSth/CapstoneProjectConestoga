import React, { useEffect, useState } from 'react';
import useBillSplitStore from '../../../store/useBillSpiltStore';
import Header from '../../../layouts/Header';
import Navbar from '../../../layouts/Navbar';
import BillCard from '../../ui/BillCard';

const BillSplit = () => {
  const [bills, setBills] = useState([
    {
      id: 1,
      title: 'Grocery Shopping',
      description: 'Trip to T&T Supermarket',
      createdAt: 'August 28, 2022',
      amount: 200,
      remainingAmount: 80,
      members: [
        { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '111-222-3333',
        },
      ],
    },
    {
      id: 2,
      title: 'Dinner Outing',
      description: 'Dinner at Olive Garden',
      createdAt: 'September 1, 2022',
      amount: 150,
      remainingAmount: 50,
      members: [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '098-765-4321',
        },
        { name: 'Bob Brown', email: 'bob@example.com', phone: '444-555-6666' },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    const calculatedTotalWithTip =
      totalBill + (totalBill * tipPercentage) / 100;
    setTotalWithTip(calculatedTotalWithTip);
    setSplitAmount(calculatedTotalWithTip / numberOfPeople);
  }, [totalBill, tipPercentage, numberOfPeople]);

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
                members={[
                  { name: 'Alice Black', amountOwed: 400, image: 'alice.jpg' },
                  { name: 'Bob', amountOwed: 300, image: 'bob.jpg' },
                  { name: 'Charlie', amountOwed: 300, image: 'charlie.jpg' },
                ]}
                onEdit={() => console.log(`Editing bill ID: ${bill.id}`)}
                onDelete={() => console.log(`Deleting bill ID: ${bill.id}`)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BillSplit;
