import React from 'react';

const GroupCard = ({
  group,
  onEdit,
  onDelete,
  onClick,
  showActions = true,
}) => {
  const {
    _id,
    name,
    description = 'No description provided.',
    members = [],
  } = group;

  return (
    <div
      className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition-all"
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
        {showActions && (
          <div className="flex flex-col gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(_id);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(_id);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 focus:outline-none"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="text-base text-gray-500 mb-4">
        <span className="font-semibold flex items-center">
          Members:
          <span className="ml-2 bg-gray-200 text-gray-800 p-3 text-base rounded-full">
            {members.length}
          </span>
        </span>
      </div>
    </div>
  );
};

export default GroupCard;
