import React, { useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import "./Users.css";

const usersData = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    plan: "Premium",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@gmail.com",
    plan: "Free",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Shah",
    email: "amit@gmail.com",
    plan: "Premium",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Neha Verma",
    email: "neha@gmail.com",
    plan: "Free",
    status: "Active",
  },
  {
    id: 5,
    name: "Rohan Patel",
    email: "rohan@gmail.com",
    plan: "Premium",
    status: "Active",
  },
];

export default function Users() {
  const [search, setSearch] = useState("");

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">

      <div className="users-header">
        <div>
          <h2>Users Management</h2>
          <p>Manage all registered users.</p>
        </div>

        <button className="add-btn">
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th align="center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={
                      user.plan === "Premium"
                        ? "premium"
                        : "free"
                    }
                  >
                    {user.plan}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      user.status === "Active"
                        ? "active"
                        : "inactive"
                    }
                  >
                    {user.status}
                  </span>
                </td>

                <td className="actions">
                  <button className="view">
                    <Eye size={18} />
                  </button>

                  {/* <button className="edit">
                    <Pencil size={18} />
                  </button> */}

                  <button className="delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}