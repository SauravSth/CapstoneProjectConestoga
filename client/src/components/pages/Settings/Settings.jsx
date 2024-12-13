import React from 'react';
import { FiEdit2 } from 'react-icons/fi'; // Icon for the Edit button
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';

const Settings = () => {
  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="Settings" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Profile Header */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="flex flex-wrap items-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <div className="ml-4 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold">
                  Stephen Oladipo-Raji
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">Male</p>
                <p className="text-gray-500 text-sm sm:text-base">
                  Added on August 28, 2024
                </p>
              </div>
              <button className="ml-auto text-gray-500 hover:text-gray-700">
                <FiEdit2 />
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">Personal Information</h2>
              <button className="text-gray-500 hover:text-gray-700">
                <FiEdit2 />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <p>Stephen</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <p>Oladipo-Raji</p>
              </div>
              <div>
                <label className="block text-sm font-medium">E-mail</label>
                <p>Stephenraji666@gmail.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Phone no</label>
                <p>+1 548-333-7988</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">Address</h2>
              <button className="text-gray-500 hover:text-gray-700">
                <FiEdit2 />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium">Country</label>
                <p>Canada</p>
              </div>
              <div>
                <label className="block text-sm font-medium">City/State</label>
                <p>Ontario</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Street</label>
                <p>10 Conestoga Blvd</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Postal Code</label>
                <p>N2A 3C4</p>
              </div>
            </div>
          </div>

          {/* Password & Security */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">Password & Security</h2>
              <button className="text-gray-500 hover:text-gray-700">
                <FiEdit2 />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  className="border rounded w-full p-2"
                  disabled
                  value="********"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  className="border rounded w-full p-2"
                  disabled
                  value=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="border rounded w-full p-2"
                  disabled
                  value=""
                />
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="flex justify-center mt-6">
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 w-full sm:w-auto">
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
