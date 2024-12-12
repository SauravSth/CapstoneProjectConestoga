import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const LineChartComponent = ({ data }) => {
  return (
    <div className="w-full h-[28rem]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            label={{ value: 'Day', position: 'insideBottom' }}
          />
          <YAxis
            label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="lastMonth"
            stroke="#007bff"
            strokeWidth={2}
            name="Last Month"
          />
          <Line
            type="monotone"
            dataKey="twoMonthsAgo"
            stroke="#28a745"
            strokeWidth={2}
            name="Two Months Ago"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
