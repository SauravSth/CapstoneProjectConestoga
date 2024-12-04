import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Sample colors for the chart
const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

// PieChartComponent: Takes data as a prop
const PieChartComponent = ({ data }) => {
  return (
    <div className="w-full h-[28rem]">
      {' '}
      {/* Increased height */}
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={180} /* Increased outerRadius */
            innerRadius={
              70
            } /* Optional: Add innerRadius for a donut chart effect */
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
