import React, { useMemo, useState } from "react";

import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  Trash2,
  UserCheck,
  Users,
  Crown,
  UserX,
  ChevronLeft,
  ChevronRight,
  Download,
  UserPlus,
} from "lucide-react";

import AdminUserModal from "../components/AdminUserModal";

import "../styles/adminUsers.css";

const AdminUsers = () => {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [planFilter, setPlanFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [openMenu, setOpenMenu] =
    useState(null);

  const usersPerPage = 7;

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Yashvi Radariya",
      email: "yashvi@example.com",
      phone: "+91 98765 43210",
      initials: "YR",
      role: "Frontend Developer",
      status: "Active",
      plan: "Pro",
      joined: "Aug 10, 2026",
      coachSessions: 28,
      resumes: 4,
      roadmaps: 2,
      interviews: 5,
    },
    {
      id: 2,
      name: "Rahul Patel",
      email: "rahul@example.com",
      phone: "+91 98254 12345",
      initials: "RP",
      role: "Full Stack Developer",
      status: "Active",
      plan: "Free",
      joined: "Aug 09, 2026",
      coachSessions: 14,
      resumes: 2,
      roadmaps: 1,
      interviews: 2,
    },
    {
      id: 3,
      name: "Priya Shah",
      email: "priya@example.com",
      phone: "+91 98765 67890",
      initials: "PS",
      role: "UI/UX Designer",
      status: "Active",
      plan: "Pro",
      joined: "Aug 08, 2026",
      coachSessions: 35,
      resumes: 5,
      roadmaps: 3,
      interviews: 8,
    },
    {
      id: 4,
      name: "Aarav Mehta",
      email: "aarav@example.com",
      phone: "+91 98980 11122",
      initials: "AM",
      role: "Backend Developer",
      status: "Pending",
      plan: "Free",
      joined: "Aug 07, 2026",
      coachSessions: 5,
      resumes: 1,
      roadmaps: 1,
      interviews: 0,
    },
    {
      id: 5,
      name: "Neha Patel",
      email: "neha@example.com",
      phone: "+91 99090 22233",
      initials: "NP",
      role: "Data Analyst",
      status: "Active",
      plan: "Pro",
      joined: "Aug 06, 2026",
      coachSessions: 21,
      resumes: 3,
      roadmaps: 2,
      interviews: 4,
    },
    {
      id: 6,
      name: "Dhruv Shah",
      email: "dhruv@example.com",
      phone: "+91 98111 33344",
      initials: "DS",
      role: "Java Developer",
      status: "Blocked",
      plan: "Free",
      joined: "Aug 05, 2026",
      coachSessions: 7,
      resumes: 1,
      roadmaps: 1,
      interviews: 1,
    },
    {
      id: 7,
      name: "Kavya Joshi",
      email: "kavya@example.com",
      phone: "+91 98989 44455",
      initials: "KJ",
      role: "Software Engineer",
      status: "Active",
      plan: "Pro",
      joined: "Aug 04, 2026",
      coachSessions: 31,
      resumes: 4,
      roadmaps: 2,
      interviews: 6,
    },
    {
      id: 8,
      name: "Harsh Trivedi",
      email: "harsh@example.com",
      phone: "+91 98787 55566",
      initials: "HT",
      role: "React Developer",
      status: "Active",
      plan: "Free",
      joined: "Aug 03, 2026",
      coachSessions: 12,
      resumes: 2,
      roadmaps: 1,
      interviews: 3,
    },
    {
      id: 9,
      name: "Riya Desai",
      email: "riya@example.com",
      phone: "+91 98666 77788",
      initials: "RD",
      role: "Product Designer",
      status: "Active",
      plan: "Pro",
      joined: "Aug 02, 2026",
      coachSessions: 19,
      resumes: 3,
      roadmaps: 2,
      interviews: 4,
    },
    {
      id: 10,
      name: "Meet Joshi",
      email: "meet@example.com",
      phone: "+91 98555 88899",
      initials: "MJ",
      role: "Python Developer",
      status: "Pending",
      plan: "Free",
      joined: "Aug 01, 2026",
      coachSessions: 3,
      resumes: 1,
      roadmaps: 0,
      interviews: 0,
    },
    {
      id: 11,
      name: "Anjali Mehta",
      email: "anjali@example.com",
      phone: "+91 98444 99900",
      initials: "AM",
      role: "Cloud Engineer",
      status: "Active",
      plan: "Pro",
      joined: "Jul 31, 2026",
      coachSessions: 26,
      resumes: 3,
      roadmaps: 2,
      interviews: 5,
    },
    {
      id: 12,
      name: "Vivek Patel",
      email: "vivek@example.com",
      phone: "+91 98333 10001",
      initials: "VP",
      role: "DevOps Engineer",
      status: "Active",
      plan: "Free",
      joined: "Jul 30, 2026",
      coachSessions: 10,
      resumes: 2,
      roadmaps: 1,
      interviews: 2,
    },
  ]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.role
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" ||
        user.status === statusFilter;

      const planMatch =
        planFilter === "All" ||
        user.plan === planFilter;

      return (
        searchMatch &&
        statusMatch &&
        planMatch
      );
    });
  }, [
    users,
    search,
    statusFilter,
    planFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  const startIndex =
    (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  /* =====================================================
     RESET PAGE
  ===================================================== */

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePlanFilter = (value) => {
    setPlanFilter(value);
    setCurrentPage(1);
  };

  /* =====================================================
     BLOCK / UNBLOCK
  ===================================================== */

  const toggleUserStatus = (id) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Blocked"
                  ? "Active"
                  : "Blocked",
            }
          : user
      )
    );

    setSelectedUser((previous) => {
      if (!previous) return null;

      return {
        ...previous,
        status:
          previous.status === "Blocked"
            ? "Active"
            : "Blocked",
      };
    });

    setOpenMenu(null);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    setUsers((previousUsers) =>
      previousUsers.filter(
        (user) => user.id !== id
      )
    );

    setOpenMenu(null);
  };

  /* =====================================================
     STATS
  ===================================================== */

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const proUsers = users.filter(
    (user) => user.plan === "Pro"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked"
  ).length;

  return (
    <div className="admin-users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-users-header">

        <div>
          <span className="admin-users-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Manage CareerPilot users,
            subscriptions and account access.
          </p>
        </div>

        <div className="admin-users-header-actions">

          <button className="admin-users-export">
            <Download size={16} />
            Export
          </button>

          <button className="admin-users-add">
            <UserPlus size={16} />
            Add User
          </button>

        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="admin-users-stats">

        <div className="admin-users-stat">
          <div className="admin-users-stat-icon blue">
            <Users size={19} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
          </div>
        </div>

        <div className="admin-users-stat">
          <div className="admin-users-stat-icon green">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Active Users</span>
            <strong>{activeUsers}</strong>
          </div>
        </div>

        <div className="admin-users-stat">
          <div className="admin-users-stat-icon purple">
            <Crown size={19} />
          </div>

          <div>
            <span>Pro Users</span>
            <strong>{proUsers}</strong>
          </div>
        </div>

        <div className="admin-users-stat">
          <div className="admin-users-stat-icon red">
            <UserX size={19} />
          </div>

          <div>
            <span>Blocked</span>
            <strong>{blockedUsers}</strong>
          </div>
        </div>

      </div>

      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="admin-users-table-card">

        {/* Toolbar */}

        <div className="admin-users-toolbar">

          <div className="admin-users-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search users by name, email or role..."
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
            />

          </div>

          <div className="admin-users-filters">

            <div className="admin-filter-wrapper">
              <Filter size={15} />

              <select
                value={statusFilter}
                onChange={(e) =>
                  handleStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Blocked">
                  Blocked
                </option>
              </select>
            </div>

            <select
              className="admin-plan-filter"
              value={planFilter}
              onChange={(e) =>
                handlePlanFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Plans
              </option>

              <option value="Free">
                Free
              </option>

              <option value="Pro">
                Pro
              </option>
            </select>

          </div>

        </div>

        {/* Table */}

        <div className="admin-users-table-wrapper">

          <table className="admin-users-table">

            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    aria-label="Select all users"
                  />
                </th>

                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Plan</th>
                <th>Joined</th>
                <th>Activity</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>

                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${user.name}`}
                      />
                    </td>

                    {/* User */}

                    <td>
                      <div className="admin-table-user">

                        <div className="admin-table-avatar">
                          {user.initials}
                        </div>

                        <div>
                          <strong>
                            {user.name}
                          </strong>

                          <span>
                            {user.email}
                          </span>
                        </div>

                      </div>
                    </td>

                    {/* Role */}

                    <td>
                      <span className="admin-user-role">
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={`admin-table-status ${user.status.toLowerCase()}`}
                      >
                        <i></i>
                        {user.status}
                      </span>
                    </td>

                    {/* Plan */}

                    <td>
                      <span
                        className={`admin-table-plan ${user.plan.toLowerCase()}`}
                      >
                        {user.plan === "Pro" && (
                          <Crown size={12} />
                        )}

                        {user.plan}
                      </span>
                    </td>

                    {/* Joined */}

                    <td>
                      <span className="admin-table-date">
                        {user.joined}
                      </span>
                    </td>

                    {/* Activity */}

                    <td>
                      <div className="admin-table-activity">
                        <strong>
                          {user.coachSessions}
                        </strong>

                        <span>
                          sessions
                        </span>
                      </div>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="admin-user-actions">

                        <button
                          className="admin-more-button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === user.id
                                ? null
                                : user.id
                            )
                          }
                        >
                          <MoreHorizontal
                            size={17}
                          />
                        </button>

                        {openMenu === user.id && (
                          <div className="admin-user-menu">

                            <button
                              onClick={() => {
                                setSelectedUser(
                                  user
                                );
                                setOpenMenu(null);
                              }}
                            >
                              <Eye size={15} />
                              View details
                            </button>

                            <button
                              onClick={() =>
                                toggleUserStatus(
                                  user.id
                                )
                              }
                            >
                              {user.status ===
                              "Blocked" ? (
                                <>
                                  <UserCheck
                                    size={15}
                                  />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Ban size={15} />
                                  Block
                                </>
                              )}
                            </button>

                            <div />

                            <button
                              className="delete"
                              onClick={() =>
                                deleteUser(
                                  user.id
                                )
                              }
                            >
                              <Trash2
                                size={15}
                              />
                              Delete
                            </button>

                          </div>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="admin-empty-users"
                  >
                    <Users size={30} />

                    <strong>
                      No users found
                    </strong>

                    <span>
                      Try changing your search
                      or filters.
                    </span>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        <div className="admin-users-pagination">

          <span>
            Showing{" "}
            <strong>
              {filteredUsers.length === 0
                ? 0
                : startIndex + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(
                startIndex + usersPerPage,
                filteredUsers.length
              )}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredUsers.length}
            </strong>{" "}
            users
          </span>

          <div className="admin-pagination-buttons">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                className={
                  currentPage === page
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {page}
              </button>
            ))}

            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
            >
              <ChevronRight size={15} />
            </button>

          </div>

        </div>

      </div>

      {/* User Modal */}

      {selectedUser && (
        <AdminUserModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onToggleStatus={
            toggleUserStatus
          }
        />
      )}

    </div>
  );
};

export default AdminUsers;