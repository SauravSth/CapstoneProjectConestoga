import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="p-6 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
};

export default Header;
