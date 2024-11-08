import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BudgetExpense = () => {
  const { budgetId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/budget/${budgetId}/expenses`
        );
        const data = await response.json();
        setExpenses(data.expenses || []);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [budgetId]);

  return (
    <div>
      <h2>Expenses for Budget {budgetId}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              {expense.description} - ${expense.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BudgetExpense;
