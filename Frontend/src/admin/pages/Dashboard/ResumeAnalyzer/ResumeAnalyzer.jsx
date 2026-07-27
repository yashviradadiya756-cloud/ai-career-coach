import React, { useState } from "react";
import {
  Search,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./ResumeAnalyzer.css";

const resumeAnalysis = [
  {
    id: 1,
    name: "Rahul Sharma",
    ats: 92,
    skills: "React, Node.js, MongoDB",
    missing: "Docker, AWS",
    status: "Excellent",
  },
  {
    id: 2,
    name: "Priya Patel",
    ats: 85,
    skills: "Java, Spring Boot",
    missing: "Microservices",
    status: "Good",
  },
  {
    id: 3,
    name: "Amit Shah",
    ats: 70,
    skills: "Python, SQL",
    missing: "Machine Learning",
    status: "Average",
  },
  {
    id: 4,
    name: "Neha Verma",
    ats: 95,
    skills: "Cloud, Kubernetes",
    missing: "Terraform",
    status: "Excellent",
  },
];

export default function ResumeAnalyzer() {
  const [search, setSearch] = useState("");

  const filtered = resumeAnalysis.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="analyzer-page">

      <div className="analyzer-header">
        <h2>Resume Analyzer</h2>

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

      <div className="table-card">
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Candidate</th>
              <th>ATS Score</th>
              <th>Skills</th>
              <th>Missing Skills</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.name}</td>

                <td>
                  <span className="ats-score">
                    {item.ats}%
                  </span>
                </td>

                <td>{item.skills}</td>

                <td>{item.missing}</td>

                <td>
                  <span
                    className={
                      item.status === "Excellent"
                        ? "excellent"
                        : item.status === "Good"
                        ? "good"
                        : "average"
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
          <div className="empty-state">
            <AlertCircle size={50} />
            <h3>No Resume Found</h3>
          </div>
        )}

      </div>

    </div>
  );
}