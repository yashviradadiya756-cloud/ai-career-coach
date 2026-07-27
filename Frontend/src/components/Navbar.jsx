import React from 'react';
import Logo from "../assets/CareerPilot Logo.png";
import { Link } from "react-router-dom";
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
 
  return (
  <>
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logoContainer}>
      <div style={{
            width: "180px",
            height: "70px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center"
          }}>
      <img
        src={Logo}
        alt="Logo"
        style={{
          width: "300%",
          height: "260%",
          objectFit: "contain"
        }}/>
  </div>
</div>

        {/* Links */}
        <div style={styles.links}>
        <a href="#" style={styles.link}>Home</a>
        <a href="#features" style={styles.link}>Features</a>
        <a href="#demo" style={styles.link}>Interactive Demo</a>
        {/* <Link to="/Demo" style={styles.link}>
          Interactive Demo
        </Link> */}
        <a href="#pricing" style={styles.link}>Pricing</a>
        {/* <Link to="/pricing" style={styles.link}>
          Pricing
        </Link> */}

        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>

        {/* <button style={styles.btn}>
          Sign Up / Login
        </button> */}
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button style={styles.btn}>
            Sign In / Login
          </button>
        </Link>
      </div>
    </nav>
  </>
);
}

const styles = {
  nav: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 40px",
  height: "70px",
  background: "#0b0000",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 1000,
},
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--primary)',
    display: 'block'
  },
  subLogo: {
    fontSize: '11px',
    color: 'var(--gray)',
    display: 'block',
    marginTop: '-2px'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px'
  },
  link: {
    color: 'white',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'color 0.2s'
  },
  btn: {
  padding: "8px 18px",
  background: "var(--primary)",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "500",
  cursor: "pointer",
  fontSize: "14px"
},

dropdownItem: {
  display: "block",
  padding: "12px 16px",
  color: "#111827",
  textDecoration: "none",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  cursor: "pointer"
}
};
