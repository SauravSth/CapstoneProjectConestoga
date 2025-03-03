const Card = ({
  name,
  description,
  createdDate,
  totalAmount, // Keep original name for budget
  remainingAmount, // Keep original name for budget
  goalAmount, // New name for goal
  savedAmount,
  onClick, // New name for goal
  onEditClick,
  onDeleteClick,
  type,
}) => {
  // Determine the values based on the type
  const displayedTotalAmount = type === 'goal' ? goalAmount : totalAmount;
  const displayedRemainingAmount =
    type === 'goal' ? savedAmount : remainingAmount;

  // Calculate the percentage of the saved/remaining amount
  const percentage = (
    (displayedRemainingAmount / displayedTotalAmount) *
    100
  ).toFixed(2);

  // Disable the onClick function if the goal is complete
  const isGoalComplete = type === 'goal' && goalAmount === savedAmount;
  const handleClick = isGoalComplete ? null : onClick;

  return (
    <div
      className={`card p-6 bg-white rounded-lg shadow-xl cursor-pointer transition-transform transform hover:scale-105 ${type}-card ${
        isGoalComplete ? 'opacity-50 pointer-events-none' : ''
      }`}
      onClick={handleClick}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-2xl text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">
          Created on: {new Date(createdDate).toLocaleDateString()}
        </p>
      </div>

      {/* Card Details */}
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="flex items-center mt-4 space-x-4">
        <p className="font-bold text-lg text-gray-800">
          {type === 'goal' ? 'Target' : 'Total'}: ${displayedTotalAmount}
        </p>
        <p className="text-sm text-gray-600">
          {type === 'goal' ? 'Saved' : 'Remaining'}: ${displayedRemainingAmount}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: `#80C028`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {percentage}% {type === 'goal' ? 'Saved' : 'Remaining'}
        </p>
      </div>

      <div className="flex gap-4">
        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent div click
              onEditClick();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Edit Details
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent div click
              onDeleteClick();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
