import React from 'react';
import { Link } from 'react-router-dom';

import { FiLogIn } from 'react-icons/fi';

const Header = ({ title }) => {
  return (
    <header className="p-6 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
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
