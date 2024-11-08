const BudgetCard = ({
  name,
  description,
  createdDate,
  totalAmount,
  onClick,
}) => {
  return (
    <div
      className="budget-card p-4 bg-white rounded-lg shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-bold">{name}</h3>
      <p>{description}</p>
      <p>Created on: {new Date(createdDate).toLocaleDateString()}</p>
      <p>Total Amount: ${totalAmount}</p>
    </div>
  );
};

export default BudgetCard;
