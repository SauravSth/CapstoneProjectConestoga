import React, { useState, useEffect } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import PieChartComponent from '../../ui/PieChart';
import LineChartComponent from '../../ui/LineChart';

const Home = () => {
  const [expenseSum, setExpenseSum] = useState(null);
  const [groups, setGroups] = useState(null);
  const [goals, setGoals] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const expenseResponse = await fetch(
          'http://localhost:3000/api/expense',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!expenseResponse.ok) {
          throw new Error(`HTTP error! Status: ${expenseResponse.status}`);
        }

        let expenseData = await expenseResponse.json();

        let sumExpense = expenseData.expenses.reduce((sum, expense) => {
          return sum + expense.amount;
        }, 0); // Start with 0 as the initial sum

        console.log(sumExpense); // This will log 5160

        setExpenseSum(sumExpense);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchGroupData = async () => {
      try {
        const groupResponse = await fetch('http://localhost:3000/api/group', {
          method: 'GET',
          credentials: 'include',
        });

        if (!groupResponse.ok) {
          throw new Error(`HTTP error! Status: ${groupResponse.status}`);
        }

        let groupData = await groupResponse.json();

        setGroups(groupData.groups.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchGoalData = async () => {
      try {
        const goalResponse = await fetch('http://localhost:3000/api/goal', {
          method: 'GET',
          credentials: 'include',
        });

        if (!goalResponse.ok) {
          throw new Error(`HTTP error! Status: ${goalResponse.status}`);
        }

        let goalData = await goalResponse.json();

        setGoals(goalData.goals.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchPieData = async () => {
      const response = await fetch(
        'http://localhost:3000/api/graph/getExpensePerCategory',
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      const data = await response.json();
      setPieChartData(Array.isArray(data) ? data : data.graphData || []);
    };

    const fetchLineData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/graph/getExpensePerMonth',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();

        const lastMonthData = processDailyData(
          data.groupedLastMonth,
          'Last Month'
        );
        const twoMonthsAgoData = processDailyData(
          data.groupedTwoMonthsAgo,
          'Two Months Ago'
        );

        const combinedData = mergeDailyData(lastMonthData, twoMonthsAgoData);
        setCombinedData(combinedData);
      } catch (error) {
        console.error('Error fetching line chart data:', error);
      }
    };

    fetchExpenseData();
    fetchGroupData();
    fetchGoalData();
    fetchPieData();
    fetchLineData();
  }, []);

  const processDailyData = (groupedData, label) => {
    const result = [];

    Object.entries(groupedData || {}).forEach(([date, details]) => {
      const day = new Date(date).getDate(); // Extract day of the month
      result.push({
        day, // X-axis: Day of the month
        totalAmount: details.totalAmount, // Y-axis: Total daily amount
        label, // Label for the line ("Last Month" or "Two Months Ago")
      });
    });

    return result;
  };

  const mergeDailyData = (lastMonthData, twoMonthsAgoData) => {
    const maxDays = Math.max(
      ...[...lastMonthData, ...twoMonthsAgoData].map((item) => item.day)
    );

    const mergedData = Array.from({ length: maxDays }, (_, i) => {
      const day = i + 1; // Days start at 1
      const lastMonthEntry =
        lastMonthData.find((item) => item.day === day) || {};
      const twoMonthsAgoEntry =
        twoMonthsAgoData.find((item) => item.day === day) || {};

      return {
        day,
        lastMonth: lastMonthEntry.totalAmount || 0,
        twoMonthsAgo: twoMonthsAgoEntry.totalAmount || 0,
      };
    });

    return mergedData;
  };

  const chartData = pieChartData.map((item) => ({
    name: item.category,
    value: item.amountSpent,
  }));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header title="Overview" />

        <main className="p-8 space-y-6">
          <h1>Hi User</h1>
          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Messages Section */}
            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold flex justify-between items-center">
                Total Expenses
                <span className="ml-auto">${expenseSum}</span>
              </h2>
            </div>

            {/* Activity Section */}
            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold flex justify-between items-center">
                Total Groups
                <span className="ml-auto">{groups}</span>
              </h2>
            </div>

            {/* Messages Section */}
            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold flex justify-between items-center">
                Total Goals
                <span className="ml-auto">{goals}</span>
              </h2>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl mb-4 font-semibold">
                Comparing Expenses
              </h2>
              <LineChartComponent data={combinedData} />
            </div>

            {/* Tasks Section */}
            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold">Category Expenses</h2>
              <PieChartComponent data={chartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
