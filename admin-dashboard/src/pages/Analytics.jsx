import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import DashboardLayout from "../components/DashboardLayout";

const salesData = [
  { date: "Mon", total: 1500 },
  { date: "Tue", total: 2000 },
  { date: "Wed", total: 1700 },
  { date: "Thu", total: 2500 },
  { date: "Fri", total: 3000 },
];

const Analytics = () => {
  return (
    <DashboardLayout user={{ username: "admin" }}>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="bg-white shadow-md p-5 rounded-lg">
        <BarChart width={600} height={300} data={salesData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;