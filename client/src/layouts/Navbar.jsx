import React from 'react';
import { Link } from 'react-router-dom';
import useNavbarStore from '../store/useNavbarStore';
import useViewModeStore from '../store/useViewModeStore';
import Logo from '../assets/img/Logo.png';
import { IoPeopleSharp } from 'react-icons/io5';
import { MdGroups } from 'react-icons/md';
import {
  TbLayoutDashboard,
  TbReceiptDollar,
  TbSettings,
  TbLogout,
} from 'react-icons/tb';
import { FaBoxArchive, FaChartSimple } from 'react-icons/fa6';

const Navbar = () => {
  const { activePage, setActivePage } = useNavbarStore();
  const { viewMode } = useViewModeStore(); // Access viewMode from useViewModeStore

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
          <li
            className={`flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer ${
              activePage === 'Overview' ? 'bg-green-700' : 'hover:bg-green-700'
            }`}
          >
            <Link
              to="/"
              onClick={() => setActivePage('Overview')}
              className="flex items-center space-x-4"
            >
              <TbLayoutDashboard size={20} />
              <span>Overview</span>
            </Link>
          </li>

          <li
            className={`flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer ${
              activePage === 'Budget' ? 'bg-green-700' : 'hover:bg-green-700'
            }`}
          >
            <Link
              to="/budget"
              onClick={() => setActivePage('Budget')}
              className="flex items-center space-x-4"
            >
              <TbReceiptDollar size={20} />
              <span>Budget</span>
            </Link>
          </li>

          <li
            className={`flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer ${
              activePage === 'All Expenses'
                ? 'bg-green-700'
                : 'hover:bg-green-700'
            }`}
          >
            <Link
              to="/all-expenses"
              onClick={() => setActivePage('All Expenses')}
              className="flex items-center space-x-4"
            >
              <FaChartSimple size={20} />
              <span>All Expenses</span>
            </Link>
          </li>

          {/* Conditionally render People and Groups based on viewMode */}
          {viewMode !== 'Personal' && (
            <>
              <li
                className={`flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer ${
                  activePage === 'People'
                    ? 'bg-green-700'
                    : 'hover:bg-green-700'
                }`}
              >
                <Link
                  to="/people"
                  onClick={() => setActivePage('People')}
                  className="flex items-center space-x-4"
                >
                  <IoPeopleSharp size={20} />
                  <span>People</span>
                </Link>
              </li>

              <li
                className={`flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer ${
                  activePage === 'Groups'
                    ? 'bg-green-700'
                    : 'hover:bg-green-700'
                }`}
              >
                <Link
                  to="/groups"
                  onClick={() => setActivePage('Groups')}
                  className="flex items-center space-x-4"
                >
                  <MdGroups size={20} />
                  <span>Groups</span>
                </Link>
              </li>
            </>
          )}

          <li
            className={`flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer ${
              activePage === 'Categories'
                ? 'bg-green-700'
                : 'hover:bg-green-700'
            }`}
          >
            <Link
              to="/categories"
              onClick={() => setActivePage('Categories')}
              className="flex items-center space-x-4"
            >
              <FaBoxArchive size={20} />
              <span>Categories</span>
            </Link>
          </li>

          <li
            className={`flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer ${
              activePage === 'Settings' ? 'bg-green-700' : 'hover:bg-green-700'
            }`}
          >
            <Link
              to="/settings"
              onClick={() => setActivePage('Settings')}
              className="flex items-center space-x-4"
            >
              <TbSettings size={20} />
              <span>Settings</span>
            </Link>
          </li>

          <li
            className={
              'flex items-center space-x-4 p-4 text-lg tracking-wide my-6 rounded-lg cursor-pointer hover:bg-green-700'
            }
          >
            <Link
              to="/logout"
              className="flex items-center space-x-4"
            >
              <TbLogout size={20} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
