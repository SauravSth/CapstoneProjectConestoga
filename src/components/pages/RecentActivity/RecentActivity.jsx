import React from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';

const RecentActivity = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="Recent Activity" />

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>
        </main>
      </div>
    </div>
  );
};

export default RecentActivity;
