import React, { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Brain,
} from "lucide-react";
import "./SkillGap.css";

const skillData = [
  {
    id: 1,
    name: "Rahul Sharma",
    currentSkill: "React, JavaScript",
    missingSkill: "Node.js, MongoDB",
    progress: 75,
    recommendation: "Full Stack Development",
  },
  {
    id: 2,
    name: "Priya Patel",
    currentSkill: "HTML, CSS",
    missingSkill: "React, Git",
    progress: 55,
    recommendation: "Frontend Development",
  },
  {
    id: 3,
    name: "Amit Shah",
    currentSkill: "Python",
    missingSkill: "Machine Learning",
    progress: 40,
    recommendation: "AI & ML",
  },
  {
    id: 4,
    name: "Neha Verma",
    currentSkill: "AWS",
    missingSkill: "Docker, Kubernetes",
    progress: 82,
    recommendation: "Cloud Engineer",
  },
];

export default function SkillGap() {
  const [search, setSearch] = useState("");

  const filtered = skillData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.recommendation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="skillgap-page">

      <div className="skillgap-header">
        <h2>Skill Gap Analysis</h2>

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

      <div className="skillgap-card">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Current Skills</th>
              <th>Missing Skills</th>
              <th>Progress</th>
              <th>Recommendation</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.name}</td>

                <td>{item.currentSkill}</td>

                <td>{item.missingSkill}</td>

                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <span>{item.progress}%</span>
                </td>

                <td>
                  <span className="recommendation">
                    {item.recommendation}
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
          <div className="empty-state">
            <Brain size={50} />
            <h3>No Skill Gap Data Found</h3>
          </div>
        )}

      </div>

    </div>
  );
}