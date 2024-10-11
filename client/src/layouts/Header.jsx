import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../assets/img/Logo.png';
import { FiLogIn } from 'react-icons/fi';

const Header = ({ title }) => {
  return (
    <header className="p-6 bg-white shadow-md flex justify-between items-center">
      {title ? (
        <h1 className="text-2xl font-bold">{title}</h1>
      ) : (
        <div className="flex items-center justify-center">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="h-10"
            />
          </Link>
        </div>
      )}

      <Link
        to="/login"
        className="flex items-center space-x-4"
      >
        <span>Login</span>
      </Link>
    </header>
  );
};

export default Header;
