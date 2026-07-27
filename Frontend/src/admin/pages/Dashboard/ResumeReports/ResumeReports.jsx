import React, { useState } from "react";
import {
  Search,
  Eye,
  Download,
  Trash2,
  FileText,
} from "lucide-react";
import "./ResumeReports.css";

const resumeData = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    ats: 92,
    date: "22 Jul 2026",
    status: "Reviewed",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@gmail.com",
    ats: 78,
    date: "21 Jul 2026",
    status: "Pending",
  },
  {
    id: 3,
    name: "Amit Shah",
    email: "amit@gmail.com",
    ats: 85,
    date: "20 Jul 2026",
    status: "Reviewed",
  },
];

export default function ResumeReports() {
  const [search, setSearch] = useState("");

  const filtered = resumeData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="resume-page">

      <div className="resume-header">
        <h2>Resume Reports</h2>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="resume-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Candidate</th>
              <th>Email</th>
              <th>ATS</th>
              <th>Date</th>
              <th>Status</th>
              <th align="center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>

                <td>
                  <span className="ats">{item.ats}%</span>
                </td>

                <td>{item.date}</td>

                <td>
                  <span
                    className={
                      item.status === "Reviewed"
                        ? "reviewed"
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

                  <button className="download">
                    <Download size={18} />
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
            <FileText size={45} />
            <p>No Resume Reports Found</p>
          </div>
        )}
      </div>
    </div>
  );
}