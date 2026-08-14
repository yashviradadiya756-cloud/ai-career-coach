import React from "react";
import { User, Mail, ShieldCheck } from "lucide-react";

const AdminProfile = () => {
  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100%",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={34} />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "25px",
                  fontWeight: "700",
                }}
              >
                Admin Profile
              </h1>

              <p
                style={{
                  marginTop: "6px",
                  color: "#64748b",
                }}
              >
                Manage administrator account information
              </p>
            </div>
          </div>

          {/* Name */}
          <div
            style={{
              padding: "18px 0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <User size={20} />

              <div>
                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  Name
                </small>

                <div
                  style={{
                    fontWeight: "600",
                    marginTop: "3px",
                  }}
                >
                  {adminUser.name ||
                    adminUser.username ||
                    "Administrator"}
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div
            style={{
              padding: "18px 0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Mail size={20} />

              <div>
                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  Email
                </small>

                <div
                  style={{
                    fontWeight: "600",
                    marginTop: "3px",
                  }}
                >
                  {adminUser.email || "No email"}
                </div>
              </div>
            </div>
          </div>

          {/* Role */}
          <div
            style={{
              padding: "18px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <ShieldCheck size={20} />

              <div>
                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  Account Role
                </small>

                <div
                  style={{
                    fontWeight: "600",
                    marginTop: "3px",
                    textTransform: "capitalize",
                  }}
                >
                  {adminUser.role || "admin"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfile;