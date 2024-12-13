import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNavbarStore from '../store/useNavbarStore';
import useAuthStore from '../store/useAuthStore';
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
import { FaUsersCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

  const { activePage, setActivePage } = useNavbarStore();
  const { viewMode } = useViewModeStore();

  useEffect(() => {
    if (isAuthenticated && user?.message === 'Admin Logged In') {
      setUserType('Admin');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex flex-col h-full w-full max-w-xs bg-green-900 text-white py-6">
      <div className="flex items-center justify-center py-4 border-b border-gray-700">
        <img
          src={Logo}
          alt="Logo"
          className="h-10"
        />
      </div>
      <ul className="mt-4 space-y-4 px-4">
        {userType === 'User' ? (
          <>
            <li>
              <Link
                to="/"
                onClick={() => setActivePage('Overview')}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  activePage === 'Overview'
                    ? 'bg-green-700'
                    : 'hover:bg-green-700'
                }`}
              >
                <TbLayoutDashboard size={20} />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link
                to="/budget"
                onClick={() => setActivePage('Budget')}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  activePage === 'Budget'
                    ? 'bg-green-700'
                    : 'hover:bg-green-700'
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
                  onClick={() => setActivePage('All Expenses')}
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
                    onClick={() => setActivePage('Bill Split')}
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
                    onClick={() => setActivePage('Groups')}
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
                onClick={() => setActivePage('Goals')}
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
                to="/settings"
                onClick={() => setActivePage('Settings')}
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
          </>
        ) : (
          <>
            <li>
              <Link
                to="/admin/users"
                onClick={() => setActivePage('Users')}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  activePage === 'Users' ? 'bg-green-700' : 'hover:bg-green-700'
                }`}
              >
                <FaUsersCog size={20} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categories"
                onClick={() => setActivePage('Categories')}
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
          </>
        )}
        <li>
          <Link
            to="/logout"
            className="flex items-center space-x-4 p-4 rounded-lg hover:bg-green-700"
          >
            <TbLogout size={20} />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
