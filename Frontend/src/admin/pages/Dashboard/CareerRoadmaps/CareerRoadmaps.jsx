import React, { useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Map,
} from "lucide-react";
import "./CareerRoadmaps.css";

const roadmapData = [
  {
    id: 1,
    name: "Rahul Sharma",
    target: "Full Stack Developer",
    milestone: "React Completed",
    progress: 70,
    duration: "6 Months",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Priya Patel",
    target: "UI/UX Designer",
    milestone: "Figma Completed",
    progress: 90,
    duration: "4 Months",
    status: "Completed",
  },
  {
    id: 3,
    name: "Amit Shah",
    target: "Data Scientist",
    milestone: "Python Basics",
    progress: 45,
    duration: "8 Months",
    status: "In Progress",
  },
  {
    id: 4,
    name: "Neha Verma",
    target: "Cloud Engineer",
    milestone: "AWS Certified",
    progress: 100,
    duration: "7 Months",
    status: "Completed",
  },
];

export default function CareerRoadmaps() {
  const [search, setSearch] = useState("");

  const filtered = roadmapData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="roadmap-page">

      <div className="roadmap-header">
        <h2>Career Roadmaps</h2>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="roadmap-card">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Target Career</th>
              <th>Milestone</th>
              <th>Progress</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.name}</td>

                <td>{item.target}</td>

                <td>{item.milestone}</td>

                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>

                  {item.progress}%
                </td>

                <td>{item.duration}</td>

                <td>
                  <span
                    className={
                      item.status === "Completed"
                        ? "completed"
                        : "progress"
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td className="actions">

                  <button className="view">
                    <Eye size={18} />
                  </button>

                  <button className="edit">
                    <Pencil size={18} />
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
          <div className="empty-state">
            <Map size={55} />
            <h3>No Career Roadmap Found</h3>
          </div>
        )}

      </div>

    </div>
  );
}