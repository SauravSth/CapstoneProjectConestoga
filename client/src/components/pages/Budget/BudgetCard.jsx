import React from 'react';
import Card from '../../ui/Card';

const BudgetCard = (props) => {
  return (
    <Card
      {...props}
      type="budget"
    />
  );
};

export default BudgetCard;
