import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Graph({ data, type = 'line', title }) {

  const renderChart = () => {
    switch (type) {

      // ---------------- LINE CHART ----------------
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }}
            />
          </LineChart>
        );

      // ---------------- BAR CHART ----------------
      case 'bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} stroke="#9ca3af" tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />

            {/* Paid → Green */}
            <Bar
              dataKey="Paid"
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
            />

            {/* Unpaid → Blue */}
            <Bar
              dataKey="Unpaid"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      // ---------------- PIE CHART (FIXED) ----------------
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}        // ⭐ IMPORTANT (fix)
              paddingAngle={3}        // ⭐ spacing between slices
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || "#8884d8"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default:
        return <div>Invalid chart type</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {title}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
