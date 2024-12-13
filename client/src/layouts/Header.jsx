import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useViewModeStore from '../store/useViewModeStore';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import Navbar from './Navbar'; // Import Navbar component

const Header = ({ title }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const { viewMode, toggleViewMode } = useViewModeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="p-6 bg-white shadow-md flex justify-between items-center relative">
      {/* Title */}
      <h1 className="text-2xl font-bold hidden sm:block">{title}</h1>

      {/* Mobile Hamburger Menu */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800 focus:outline-none"
        >
          {isMenuOpen ? (
            <HiOutlineX className="w-6 h-6" />
          ) : (
            <HiOutlineMenuAlt3 className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navbar Dropdown for Mobile */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-transparent backdrop-blur-md shadow-lg z-50 p-4">
          <Navbar />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-6">
        {/* Toggle Switch */}
        {user?.message === 'User Logged In' && (
          <div className="flex items-center space-x-2">
            <span>{viewMode} View</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={viewMode === 'Group'}
                onChange={toggleViewMode}
              />
              <div
                className={`w-10 h-5 rounded-full transition ${
                  viewMode === 'Group' ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
                    viewMode === 'Group' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </label>
          </div>
        )}
        {/* Authenticated Actions */}
        {isAuthenticated ? (
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-gray-800">Hello {user?.user.firstName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <FiLogOut />
              <span>Goodbye</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden sm:flex items-center space-x-2"
          >
            <FiLogIn />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
