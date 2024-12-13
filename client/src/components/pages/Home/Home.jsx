import React, { useState, useEffect } from 'react';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import PieChartComponent from '../../ui/PieChart';
import LineChartComponent from '../../ui/LineChart';

import useAuthStore from '../../../store/useAuthStore';

const Home = () => {
  const [expenseSum, setExpenseSum] = useState(null);
  const [groups, setGroups] = useState(null);
  const [goals, setGoals] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const expenseResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/expense`,
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
        const groupResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/group`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

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
        const goalResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/goal`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

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
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/api/graph/getExpensePerCategory`,
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
          `${
            import.meta.env.VITE_REACT_APP_SERVER_URL
          }/api/graph/getExpensePerMonth`,
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
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-lg h-full">
        <Navbar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        <Header title="Overview" />

        <main className="p-4 sm:p-6 md:p-8 space-y-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{`Hi ${user?.user.firstName}`}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Expenses Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl font-semibold flex justify-between items-center">
                Total Expenses
                <span className="text-green-600 text-base sm:text-lg font-bold ml-auto">
                  ${expenseSum}
                </span>
              </h2>
            </div>

            {/* Total Groups Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl font-semibold flex justify-between items-center">
                Total Groups
                <span className="text-blue-600 text-base sm:text-lg font-bold ml-auto">
                  {groups}
                </span>
              </h2>
            </div>

            {/* Total Goals Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl font-semibold flex justify-between items-center">
                Total Goals
                <span className="text-purple-600 text-base sm:text-lg font-bold ml-auto">
                  {goals}
                </span>
              </h2>
            </div>

            {/* Comparing Expenses Section */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                Comparing Expenses
              </h2>
              <div className="w-full ">
                <LineChartComponent data={combinedData} />
              </div>
            </div>

            {/* Category Expenses Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                Category Expenses
              </h2>
              <div className="w-full">
                <PieChartComponent data={chartData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
