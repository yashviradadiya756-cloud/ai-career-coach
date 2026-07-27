import React, { useState } from "react";
import {
  Search,
  Eye,
 Download,
  Trash2,
  Mic,
} from "lucide-react";
import "./MockInterviews.css";

const interviewData = [
  {
    id: 1,
    name: "Rahul Sharma",
    type: "Frontend Developer",
    technical: 88,
    communication: 90,
    overall: 89,
    date: "22 Jul 2026",
    status: "Completed",
  },
  {
    id: 2,
    name: "Priya Patel",
    type: "UI/UX Designer",
    technical: 81,
    communication: 86,
    overall: 84,
    date: "21 Jul 2026",
    status: "Completed",
  },
  {
    id: 3,
    name: "Amit Shah",
    type: "Data Scientist",
    technical: 72,
    communication: 75,
    overall: 73,
    date: "20 Jul 2026",
    status: "Pending",
  },
  {
    id: 4,
    name: "Neha Verma",
    type: "Cloud Engineer",
    technical: 95,
    communication: 92,
    overall: 94,
    date: "18 Jul 2026",
    status: "Completed",
  },
];

export default function MockInterviews() {
  const [search, setSearch] = useState("");

  const filtered = interviewData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mock-page">

      <div className="mock-header">
        <h2>Mock Interview Management</h2>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mock-card">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Candidate</th>
              <th>Interview</th>
              <th>Technical</th>
              <th>Communication</th>
              <th>Overall</th>
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

                <td>{item.type}</td>

                <td>{item.technical}%</td>

                <td>{item.communication}%</td>

                <td>
                  <span className="score">
                    {item.overall}%
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
                    <Eye size={18}/>
                  </button>

                  <button className="download">
                    <Download size={18}/>
                  </button>

                  <button className="delete">
                    <Trash2 size={18}/>
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <Mic size={60}/>
            <h3>No Interview Records Found</h3>
          </div>
        )}

      </div>

    </div>
  );
}