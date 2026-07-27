import React from "react";
import "./Navbar.css";
// import adminPhoto from "../assets/admin.jpg";

export default function Topbar() {
  return (
    <header
      style={{
        height: "75px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        flexShrink: 0,
      }}>
      <input
        type="text"
        placeholder="Search something..."
        style={{
          width: "380px",
          padding: "12px 18px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          outline: "none",
          fontSize: "15px",
        }}/>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}>
        <div
          style={{
            position: "relative",
            fontSize: "28px",
            cursor: "pointer",
          }}>
          🔔
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-6px",
              background: "red",
              color: "#fff",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            3
          </span>
        </div>

        <div style={{ textAlign: "right" }}>
          <h4
            style={{
              margin: 0,
              fontSize: "18px",
            }}>
            Yashvi Radadiya
          </h4>

          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}>
            Super Admin
          </p>
          
        </div>
      </div>
    </header>
  );
}