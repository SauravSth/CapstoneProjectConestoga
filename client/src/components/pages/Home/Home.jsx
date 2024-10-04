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
            {/* Card 1 */}
            <div className="bg-white shadow-md p-4 rounded-lg">
              <div className="text-lg font-semibold">
                <PiSirenFill /> Emergency Fund
              </div>
              <div className="text-sm text-gray-500">
                Last Paid on August 28, 2022
              </div>
              <div className="text-xl font-bold">$300 / $1000</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: '30%' }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">30%</div>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-md p-4 rounded-lg">
              <div className="text-lg font-semibold">
                <MdOutlineFlightTakeoff />
                Travel Plan
              </div>
              <div className="text-sm text-gray-500">
                Last Paid on June 1, 2022
              </div>
              <div className="text-xl font-bold">$10,000 / $20,000</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: '50%' }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">50%</div>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-md p-4 rounded-lg">
              <div className="text-lg font-semibold">
                <FaUniversity />
                Education
              </div>
              <div className="text-sm text-gray-500">
                Last Paid on May 14, 2022
              </div>
              <div className="text-xl font-bold">$7,000 / $10,000</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: '70%' }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">70%</div>
            </div>

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
