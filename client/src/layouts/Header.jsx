import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useViewModeStore from '../store/useViewModeStore';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';

const Header = ({ title, onToggleNavbar }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { viewMode, toggleViewMode } = useViewModeStore();

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:3000/api/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="p-4 bg-white shadow-md flex items-center justify-between">
      {/* Hamburger Menu (Visible on Mobile) */}
      <button
        onClick={onToggleNavbar}
        className="text-gray-700 text-2xl md:hidden focus:outline-none"
        aria-label="Toggle Menu"
      >
        <FaBars />
      </button>

      {/* Title Section */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>

      {/* Right Section: View Mode Toggle and Authentication Links */}
      <div className="flex items-center space-x-4">
        {/* Toggle Switch for View Mode */}
        <div className="flex items-center space-x-2">
          <span className="text-sm">{viewMode} View</span>
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

        {/* Authentication Links */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-sm">Hello, {user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-500 hover:text-red-700"
            >
              <FiLogOut />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
          >
            <FiLogIn />
            <span className="hidden md:inline">Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
