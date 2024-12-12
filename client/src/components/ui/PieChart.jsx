import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#007bff',
  '#28a745',
  '#ffc107',
  '#dc3545',
  '#17a2b8',
  '#6c757d',
  '#6610f2',
  '#e83e8c',
  '#fd7e14',
  '#20c997',
  '#343a40',
  '#ff5733',
  '#c70039',
  '#900c3f',
  '#581845',
  '#1e90ff',
  '#2ecc71',
  '#f1c40f',
  '#e74c3c',
  '#8e44ad',
];

const PieChartComponent = ({ data }) => {
  return (
    <div className="w-full h-[28rem]">
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
