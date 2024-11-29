import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useNavbarStore from '../store/useNavbarStore';
import useViewModeStore from '../store/useViewModeStore';
import Logo from '../assets/img/Logo.png';
import {
  TbLayoutDashboard,
  TbReceiptDollar,
  TbSettings,
  TbLogout,
  TbReceiptTax,
  TbTargetArrow,
} from 'react-icons/tb';
import { IoPeopleSharp } from 'react-icons/io5';
import { FaBoxArchive, FaChartSimple } from 'react-icons/fa6';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { activePage, setActivePage } = useNavbarStore();
  const { viewMode } = useViewModeStore();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Navbar Header for Mobile */}
      <div className="md:hidden bg-green-900 text-white p-4 flex items-center justify-between">
        <img src={Logo} alt="Logo" className="h-10" />
        <button
          onClick={toggleMenu}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar for Desktop and Mobile */}
      <div
        className={`flex flex-col h-screen w-64 bg-green-900 fixed md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-50`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center py-4 border-b border-gray-700">
          <img src={Logo} alt="Logo" className="h-10" />
        </div>

        {/* Navigation Links */}
        <ul className="mt-4 space-y-4 px-4">
          <li>
            <Link
              to="/"
              onClick={() => {
                setActivePage('Overview');
                setIsOpen(false);
              }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                activePage === 'Overview' ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <TbLayoutDashboard size={20} />
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link
              to="/budget"
              onClick={() => {
                setActivePage('Budget');
                setIsOpen(false);
              }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                activePage === 'Budget' ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <TbReceiptDollar size={20} />
              <span>Budget</span>
            </Link>
          </li>
          {viewMode === 'Personal' ? (
            <li>
              <Link
                to="/all-expenses"
                onClick={() => {
                  setActivePage('All Expenses');
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  activePage === 'All Expenses'
                    ? 'bg-green-700'
                    : 'hover:bg-green-700'
                }`}
              >
                <FaChartSimple size={20} />
                <span>All Expenses</span>
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/bill-split"
                  onClick={() => {
                    setActivePage('Bill Split');
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-4 p-4 rounded-lg ${
                    activePage === 'Bill Split'
                      ? 'bg-green-700'
                      : 'hover:bg-green-700'
                  }`}
                >
                  <TbReceiptTax size={20} />
                  <span>Bill Split</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/group"
                  onClick={() => {
                    setActivePage('Groups');
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-4 p-4 rounded-lg ${
                    activePage === 'Groups'
                      ? 'bg-green-700'
                      : 'hover:bg-green-700'
                  }`}
                >
                  <IoPeopleSharp size={20} />
                  <span>Groups</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/goals"
              onClick={() => {
                setActivePage('Goals');
                setIsOpen(false);
              }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                activePage === 'Goals' ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <TbTargetArrow size={20} />
              <span>Goals</span>
            </Link>
          </li>
          <li>
            <Link
              to="/categories"
              onClick={() => {
                setActivePage('Categories');
                setIsOpen(false);
              }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                activePage === 'Categories'
                  ? 'bg-green-700'
                  : 'hover:bg-green-700'
              }`}
            >
              <FaBoxArchive size={20} />
              <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              onClick={() => {
                setActivePage('Settings');
                setIsOpen(false);
              }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                activePage === 'Settings'
                  ? 'bg-green-700'
                  : 'hover:bg-green-700'
              }`}
            >
              <TbSettings size={20} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-green-700"
              onClick={() => setIsOpen(false)}
            >
              <TbLogout size={20} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
