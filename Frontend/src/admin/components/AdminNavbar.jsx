import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "../styles/adminNavbar.css"

const AdminNavbar = ({
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [adminName, setAdminName] =
    useState("Yashvi");

  const [adminPhoto, setAdminPhoto] =
    useState("");

  // =====================================================
  // LOAD ADMIN PROFILE
  // =====================================================

  const loadAdminProfile = useCallback(() => {
    try {
      // -------------------------------------------------
      // LOAD PHOTO FROM ONE CENTRAL STORAGE KEY
      // -------------------------------------------------

      const savedPhoto =
        localStorage.getItem(
          "adminProfilePhoto"
        );

      setAdminPhoto(savedPhoto || "");

      // -------------------------------------------------
      // LOAD ADMIN NAME
      // -------------------------------------------------

      const savedAdmin =
        localStorage.getItem("adminUser");

      if (savedAdmin) {
        try {
          const admin = JSON.parse(savedAdmin);

          setAdminName(
            admin.name || "Yashvi"
          );

          return;
        } catch (error) {
          console.error(
            "ADMIN USER JSON ERROR:",
            error
          );
        }
      }

      // -------------------------------------------------
      // FALLBACK: ADMIN SETTINGS
      // -------------------------------------------------

      const savedSettings =
        localStorage.getItem(
          "adminSettings"
        );

      if (savedSettings) {
        try {
          const settings =
            JSON.parse(savedSettings);

          if (settings?.profile?.name) {
            setAdminName(
              settings.profile.name
            );

            return;
          }
        } catch (error) {
          console.error(
            "ADMIN SETTINGS JSON ERROR:",
            error
          );
        }
      }

      // -------------------------------------------------
      // FALLBACK: NORMAL USER
      // -------------------------------------------------

      const savedUser =
        localStorage.getItem("user");

      if (savedUser) {
        try {
          const user =
            JSON.parse(savedUser);

          setAdminName(
            user.name || "Yashvi"
          );
        } catch (error) {
          console.error(
            "USER JSON ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "ADMIN NAVBAR PROFILE ERROR:",
        error
      );
    }
  }, []);

  // =====================================================
  // LOAD PROFILE WHEN NAVBAR OPENS
  // =====================================================

  useEffect(() => {
    loadAdminProfile();
  }, [loadAdminProfile]);

  // =====================================================
  // LISTEN FOR PROFILE PHOTO UPDATE
  // =====================================================

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log(
        "ADMIN PROFILE UPDATED"
      );

      // -------------------------------------------------
      // If event contains new photo
      // -------------------------------------------------

      if (
        event?.detail &&
        Object.prototype.hasOwnProperty.call(
          event.detail,
          "photo"
        )
      ) {
        setAdminPhoto(
          event.detail.photo || ""
        );
      }

      // -------------------------------------------------
      // If event contains new name
      // -------------------------------------------------

      if (event?.detail?.name) {
        setAdminName(
          event.detail.name
        );
      }

      // -------------------------------------------------
      // Reload everything from localStorage
      // -------------------------------------------------

      loadAdminProfile();
    };

    window.addEventListener(
      "adminProfileUpdated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "adminProfileUpdated",
        handleProfileUpdate
      );
    };
  }, [loadAdminProfile]);

  // =====================================================
  // STORAGE EVENT
  // =====================================================

  useEffect(() => {
    const handleStorageChange = () => {
      loadAdminProfile();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [loadAdminProfile]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    // Keep adminProfilePhoto so it remains
    // when admin logs in again.

    navigate("/admin/login");
  };

  // =====================================================
  // ADMIN INITIAL
  // =====================================================

  const adminInitial =
    adminName
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "Y";

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <header className="admin-navbar">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="admin-navbar-left">

        <button
          type="button"
          className="mobile-sidebar-button"
          onClick={() =>
            setSidebarCollapsed(
              !sidebarCollapsed
            )
          }
        >
          <Menu size={20} />
        </button>

        <div className="admin-page-heading">

          <span>
            ADMINISTRATION
          </span>

          <h1>
            CareerPilot Admin
          </h1>

        </div>

      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="admin-navbar-right">

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="admin-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <kbd>
            ⌘ K
          </kbd>

        </div>

        {/* =================================================
            NOTIFICATION
        ================================================= */}

        <button
          type="button"
          className="admin-icon-button"
          onClick={() =>
            navigate(
              "/admin/notifications"
            )
          }
        >

          <Bell size={19} />

          <span className="notification-dot" />

        </button>

        {/* =================================================
            ADMIN PROFILE
        ================================================= */}

        <div className="admin-profile-wrapper">

          <button
            type="button"
            className="admin-profile-button"
            onClick={() =>
              setShowProfile(
                (previous) =>
                  !previous
              )
            }
          >

            {/* ============================================
                PROFILE AVATAR
            ============================================ */}

            <div className="admin-avatar">

              {adminPhoto ? (
                <img
                  src={adminPhoto}
                  alt="Admin Profile"
                  className="admin-avatar-image"
                  onError={(event) => {
                    console.error(
                      "ADMIN PHOTO FAILED TO LOAD"
                    );

                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <span>
                  {adminInitial}
                </span>
              )}

            </div>

            {/* ============================================
                ADMIN NAME
            ============================================ */}

            <div className="admin-profile-info">

              <strong>
                {adminName}
              </strong>

              <span>
                Administrator
              </span>

            </div>

            <ChevronDown size={16} />

          </button>

          {/* =================================================
              DROPDOWN
          ================================================= */}

          {showProfile && (
            <div className="admin-profile-dropdown">

              {/* PROFILE */}

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);

                  navigate(
                    "/admin/settings"
                  );
                }}
              >

                {adminPhoto ? (
                  <img
                    src={adminPhoto}
                    alt="Admin"
                    className="admin-dropdown-avatar"
                  />
                ) : (
                  <User size={16} />
                )}

                <span>
                  Profile
                </span>

              </button>

              {/* SETTINGS */}

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);

                  navigate(
                    "/admin/settings"
                  );
                }}
              >

                <Settings size={16} />

                <span>
                  Settings
                </span>

              </button>

              <div className="dropdown-divider" />

              {/* LOGOUT */}

              <button
                type="button"
                className="dropdown-logout"
                onClick={handleLogout}
              >

                <LogOut size={16} />

                <span>
                  Logout
                </span>

              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;