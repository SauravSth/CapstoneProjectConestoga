import React from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import DashboardCard from '../../ui/DashboardCard';

import { PiSirenFill } from 'react-icons/pi';
import { MdOutlineFlightTakeoff } from 'react-icons/md';
import { FaUniversity } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="Overview" />

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>

          {/* Cards Section */}
          <section className="grid grid-cols-3 gap-6">
            <DashboardCard
              cardIcon={<PiSirenFill />}
              cardTitle="Emergency Fund"
            />
            <DashboardCard
              cardIcon={<MdOutlineFlightTakeoff />}
              cardTitle="Travel Plan"
            />
            <DashboardCard
              cardIcon={<FaUniversity />}
              cardTitle="Education"
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
