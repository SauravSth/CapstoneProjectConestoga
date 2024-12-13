import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useViewModeStore from '../store/useViewModeStore';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

const Header = ({ title }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  console.log('USER', user?.message);

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
    <header className="p-6 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-6">
        {/* Toggle Switch */}
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

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span>Hello {user?.firstName}</span>
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
            className="flex items-center space-x-2"
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
