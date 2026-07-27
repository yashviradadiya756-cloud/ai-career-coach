import React, { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import "./CareerAssessment.css";

const assessmentData = [
  {
    id: 1,
    name: "Rahul Sharma",
    career: "Software Engineer",
    score: 92,
    date: "22 Jul 2026",
    status: "Completed",
  },
  {
    id: 2,
    name: "Priya Patel",
    career: "UI/UX Designer",
    score: 84,
    date: "21 Jul 2026",
    status: "Completed",
  },
  {
    id: 3,
    name: "Amit Shah",
    career: "Data Scientist",
    score: 76,
    date: "20 Jul 2026",
    status: "Pending",
  },
  {
    id: 4,
    name: "Neha Verma",
    career: "Cloud Engineer",
    score: 88,
    date: "18 Jul 2026",
    status: "Completed",
  },
];

export default function CareerAssessment() {
  const [search, setSearch] = useState("");

  const filtered = assessmentData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.career.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="assessment-page">

      <div className="assessment-header">
        <h2>Career Assessment</h2>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="assessment-card">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Career</th>
              <th>Score</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.name}</td>

                <td>{item.career}</td>

                <td>
                  <span className="score">
                    {item.score}%
                  </span>
                </td>

                <td>{item.date}</td>

                <td>
                  <span
                    className={
                      item.status === "Completed"
                        ? "completed"
                        : "pending"
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td className="actions">

                  <button className="view">
                    <Eye size={18} />
                  </button>

                  <button className="delete">
                    <Trash2 size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filtered.length === 0 && (
          <div className="empty">

            <ClipboardCheck size={50} />

            <p>No Assessment Found</p>

          </div>
        )}

      </div>

    </div>
  );
}