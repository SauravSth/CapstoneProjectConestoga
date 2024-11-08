import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

const Header = ({ title }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate(); // Import useNavigate

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:3000/api/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      logout();
      // Update app state, e.g., set user to null
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="p-6 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {isAuthenticated ? (
        <div className="flex items-center space-x-4">
          <span>Hello {user?.firstName}</span>
          <button
            onClick={() => handleLogout()}
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
    </header>
  );
};

export default Header;
