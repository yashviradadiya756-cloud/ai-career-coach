import React, { useEffect, useMemo, useState } from "react";

import {
  Users,
  Search,
  RefreshCw,
  Trash2,
  ShieldCheck,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  AlertTriangle,
  X,
} from "lucide-react";

import {
  getAdminUsers,
  deleteAdminUser,
} from "../../api/adminApi";

import "../styles/adminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers();

      setUsers(response.data?.users || []);
    } catch (err) {
      console.error("Admin users error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(value) ||
        user.username?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.role?.toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeleteLoading(true);

      await deleteAdminUser(selectedUser._id);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== selectedUser._id
        )
      );

      setSelectedUser(null);
    } catch (err) {
      console.error("Delete user error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="au-page">

        <div className="au-loading">

          <div className="au-spinner"></div>

          <span>
            Loading users...
          </span>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="au-page">

        <div className="au-error">

          <div className="au-error-icon">
            <AlertTriangle size={23} />
          </div>

          <h2>
            Unable to load users
          </h2>

          <p>{error}</p>

          <button onClick={loadUsers}>
            <RefreshCw size={15} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="au-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="au-header">

        <div>

          <span className="au-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            Manage and monitor registered CareerPilot users.
          </p>

        </div>

        <button
          className="au-refresh"
          onClick={loadUsers}
        >
          <RefreshCw size={15} />
          Refresh
        </button>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="au-summary">

        <div className="au-summary-icon">
          <Users size={20} />
        </div>

        <div>

          <span>
            Total registered users
          </span>

          <strong>
            {users.length}
          </strong>

        </div>

      </div>


      {/* ======================================
          TABLE BOX
      ====================================== */}

      <div className="au-box">

        {/* TOOLBAR */}

        <div className="au-toolbar">

          <div>

            <h2>
              All users
            </h2>

            <span>
              {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""}
            </span>

          </div>


          <div className="au-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search name, email or username..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                <X size={14} />
              </button>
            )}

          </div>

        </div>


        {/* ====================================
            TABLE
        ==================================== */}

        <div className="au-table-wrapper">

          <table className="au-table">

            <thead>

              <tr>

                <th>
                  USER
                </th>

                <th>
                  CONTACT
                </th>

                <th>
                  ROLE
                </th>

                <th>
                  JOINED
                </th>

                <th>
                  ACTION
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="au-empty"
                  >

                    <div className="au-empty-icon">
                      <Users size={23} />
                    </div>

                    <strong>
                      No users found
                    </strong>

                    <span>
                      Try another search term.
                    </span>

                  </td>

                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr key={user._id}>

                    {/* USER */}

                    <td>

                      <div className="au-user">

                        <div className="au-avatar">

                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}

                        </div>

                        <div>

                          <strong>
                            {user.name || "Unnamed user"}
                          </strong>

                          <span>
                            @{user.username || "username"}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* CONTACT */}

                    <td>

                      <div className="au-contact">

                        <span>
                          <Mail size={13} />
                          {user.email}
                        </span>

                        {user.phone && (
                          <span>
                            <Phone size={13} />
                            {user.phone}
                          </span>
                        )}

                      </div>

                    </td>


                    {/* ROLE */}

                    <td>

                      {user.role === "admin" ? (

                        <span className="au-role admin">

                          <ShieldCheck size={13} />

                          Admin

                        </span>

                      ) : (

                        <span className="au-role user">

                          <UserRound size={13} />

                          User

                        </span>

                      )}

                    </td>


                    {/* DATE */}

                    <td>

                      <div className="au-date">

                        <CalendarDays size={13} />

                        {formatDate(user.createdAt)}

                      </div>

                    </td>


                    {/* ACTION */}

                    <td>

                      {user.role === "admin" ? (

                        <span className="au-protected">
                          Protected
                        </span>

                      ) : (

                        <button
                          className="au-delete"
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================
          DELETE MODAL
      ====================================== */}

      {selectedUser && (

        <div className="au-modal-overlay">

          <div className="au-modal">

            <button
              className="au-modal-close"
              onClick={() =>
                setSelectedUser(null)
              }
            >
              <X size={17} />
            </button>


            <div className="au-modal-icon">
              <Trash2 size={22} />
            </div>


            <h2>
              Delete user?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedUser.name}
              </strong>
              ? This action cannot be undone.
            </p>


            <div className="au-modal-actions">

              <button
                className="au-cancel"
                onClick={() =>
                  setSelectedUser(null)
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                className="au-confirm-delete"
                onClick={handleDelete}
                disabled={deleteLoading}
              >

                {deleteLoading ? (
                  <>
                    <span className="au-small-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete User
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminUsers;