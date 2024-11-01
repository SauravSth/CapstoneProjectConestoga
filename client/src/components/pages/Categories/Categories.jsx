import React from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import CustomTable from '../../table/CustomTable';

const Categories = () => {
  const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    {
      field: 'status',
      headerName: 'Status',
      render: (status) => (
        <span className={status ? 'text-green-600' : 'text-red-600'}>
          {status ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const data = [
    { name: 'John Doe', email: 'john@example.com', status: true },
    { name: 'Jane Smith', email: 'jane@example.com', status: false },
    // Add more data as needed
  ];
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="Categories" />

        {/* Main Content */}
        <main className="p-6 space-y-6">
          <div className="text-5xl font-bold">My Wallet</div>
          <div className="text-gray-500">Keep track of your financial plan</div>
          <CustomTable
            columns={columns}
            data={data}
          />
        </main>
      </div>
    </div>
  );
};

export default Categories;
