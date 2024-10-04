import React from 'react';
import Logo from '../assets/img/Logo.png';
import { TbLayoutDashboard, TbReceiptDollar, TbSettings } from 'react-icons/tb';
import { FaBoxArchive, FaChartSimple } from 'react-icons/fa6';

const Navbar = () => {
  return (
    <div className="flex flex-col h-screen w-64 bg-green-900 text-white py-10">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-4 border-b border-gray-700">
        <img
          src={Logo}
          alt="Logo"
          className="h-10"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col mt-4 space-y-4">
        <ul className="px-4">
          <li className="flex items-center space-x-4 p-4 text-lg tracking-wide hover:bg-green-700 my-6 rounded-lg cursor-pointer">
            <TbLayoutDashboard size={20} />
            <span>Overview</span>
          </li>
          <li className="flex items-center space-x-4 p-4 text-lg tracking-wide hover:bg-green-700 my-6 rounded-lg cursor-pointer">
            <TbReceiptDollar size={20} />
            <span>Recent Activity</span>
          </li>
          <li className="flex items-center space-x-4 p-4 text-lg tracking-wide hover:bg-green-700 my-6 rounded-lg cursor-pointer">
            <FaChartSimple size={20} />
            <span>All Expenses</span>
          </li>
          <li className="flex items-center space-x-4 p-4 text-lg tracking-wide hover:bg-green-700 my-6 rounded-lg cursor-pointer">
            <FaBoxArchive size={20} />
            <span>Categories</span>
          </li>
          <li className="flex items-center space-x-4 p-4 text-lg tracking-wide hover:bg-green-700 my-6 rounded-lg cursor-pointer">
            <TbSettings size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
