import React from 'react';

const CustomTable = ({ columns, data = [], onEdit, onDelete }) => {
  return (
    <div className="flex justify-center items-center overflow-x-auto">
      <table className="table-auto w-[1200px] bg-white border border-gray-200 shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-6 py-3 text-base font-semibold text-gray-700 border-b"
              >
                {col.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b ${
                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-gray-100`}
            >
              {columns.map((col) => (
                <td
                  key={col.field}
                  className="px-6 py-4 text-center text-base text-gray-700 whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
