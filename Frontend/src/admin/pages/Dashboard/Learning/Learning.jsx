import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  BookOpen,
} from "lucide-react";
import "./Learning.css";

const courses = [
  {
    id: 1,
    title: "React.js Complete Course",
    instructor: "John Smith",
    students: 320,
    rating: 4.8,
    progress: 85,
    status: "Published",
  },
  {
    id: 2,
    title: "Node.js Bootcamp",
    instructor: "David Lee",
    students: 210,
    rating: 4.6,
    progress: 70,
    status: "Published",
  },
  {
    id: 3,
    title: "AWS Cloud",
    instructor: "Sarah Patel",
    students: 180,
    rating: 4.7,
    progress: 60,
    status: "Draft",
  },
  {
    id: 4,
    title: "MongoDB Masterclass",
    instructor: "Rahul Sharma",
    students: 250,
    rating: 4.9,
    progress: 92,
    status: "Published",
  },
];

export default function Learning() {
  const [search, setSearch] = useState("");

  const filtered = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="learning-page">

      <div className="learning-header">

        <h2>Learning Management</h2>

        <div className="header-right">

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="add-btn">
            <Plus size={18} />
            Add Course
          </button>

        </div>

      </div>

      <div className="learning-card">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Students</th>
              <th>Rating</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((course) => (

              <tr key={course.id}>

                <td>{course.id}</td>

                <td>{course.title}</td>

                <td>{course.instructor}</td>

                <td>{course.students}</td>

                <td>⭐ {course.rating}</td>

                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  {course.progress}%
                </td>

                <td>
                  <span
                    className={
                      course.status === "Published"
                        ? "published"
                        : "draft"
                    }
                  >
                    {course.status}
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

            <BookOpen size={60} />

            <h3>No Courses Found</h3>

          </div>

        )}

      </div>

    </div>
  );
}