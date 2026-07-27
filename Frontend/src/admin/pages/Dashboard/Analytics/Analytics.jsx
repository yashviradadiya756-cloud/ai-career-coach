import React from "react";
import {
  Users,
  IndianRupee,
  FileText,
  Brain,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Analytics.css";

const monthlyUsers = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 240 },
  { month: "Apr", users: 310 },
  { month: "May", users: 420 },
  { month: "Jun", users: 510 },
];

const revenue = [
  { month: "Jan", revenue: 18000 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 34000 },
  { month: "Apr", revenue: 45000 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 61000 },
];

const pieData = [
  { name: "Resume", value: 35 },
  { name: "Assessment", value: 25 },
  { name: "Interview", value: 20 },
  { name: "Roadmap", value: 20 },
];

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

export default function Analytics() {
  return (
    <div className="analytics-page">

      <h2 className="page-title">
        Analytics Dashboard
      </h2>

      <div className="analytics-cards">

        <div className="card">
          <Users size={35}/>
          <h3>12,560</h3>
          <p>Total Users</p>
        </div>

        <div className="card">
          <IndianRupee size={35}/>
          <h3>₹5,82,000</h3>
          <p>Total Revenue</p>
        </div>

        <div className="card">
          <FileText size={35}/>
          <h3>4,620</h3>
          <p>Resume Uploads</p>
        </div>

        <div className="card">
          <Brain size={35}/>
          <h3>8,930</h3>
          <p>AI Assessments</p>
        </div>

      </div>

      <div className="chart-grid">

        <div className="chart-card">

          <h3>User Growth</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyUsers}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Line
                type="monotone"
                dataKey="users"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-card">

          <h3>Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Bar
                dataKey="revenue"
                fill="#22c55e"
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="pie-section">

        <div className="pie-card">

          <h3>Platform Usage</h3>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={110}
                label
              >

                {pieData.map((entry,index)=>(
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}