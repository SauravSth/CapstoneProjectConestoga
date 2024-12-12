import React from 'react';

const GroupCard = ({ group, onEdit, onDelete, onClick }) => {
  const { _id, name, description, memberEmails = [] } = group; // Updated to use memberEmails

  return (
    <div
      className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition-all"
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className=" text-2xl font-semibold text-gray-800">{name}</h3>
        <div className="flex flex-col gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the `onClick`
              onEdit(_id);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the `onClick`
              onDelete(_id);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Group Details */}
      <p className="text-gray-600 mb-4">
        {description || 'No description provided.'}
      </p>

      {/* Members List */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="font-semibold">Members:</span>
        {memberEmails.length > 0 ? (
          <ul className="mt-2 list-disc pl-5">
            {memberEmails.map((email, index) => (
              <li
                key={index}
                className="truncate"
              >
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the `onClick`
            onDelete(_id);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 focus:outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
