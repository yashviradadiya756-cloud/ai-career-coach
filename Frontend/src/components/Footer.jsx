import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Company Section */}
        <div style={styles.company}>
          <h2 style={styles.logo}>AI Career Pilot</h2>

          <p style={styles.description}>
            Empowering students with AI-powered career guidance,
            resume analysis, interview preparation, and personalized
            learning roadmaps.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h3 style={styles.heading}>Platform</h3>
          <a href="#" style={styles.link}>Home</a>
          <a href="#features" style={styles.link}>Features</a>
          <a href="#pricing" style={styles.link}>Pricing</a>
          <a href="#demo" style={styles.link}>Live Demo</a>
          <a href="#testimonials" style={styles.link}>Testimonials</a>
        </div>

        {/* Resources */}
        <div>
          <h3 style={styles.heading}>Resources</h3>

          <a href="#" style={styles.link}>Career Blog</a>
          <a href="#" style={styles.link}>Learning Roadmaps</a>
          <a href="#" style={styles.link}>Resume Templates</a>
          <a href="#" style={styles.link}>Interview Questions</a>
          <a href="#" style={styles.link}>Career Guides</a>
          <a href="#" style={styles.link}>FAQs</a>
          <a href="#" style={styles.link}>Help Center</a>
        </div>

        {/* Company */}
        <div>
          <h3 style={styles.heading}>Company</h3>
          <Link to="/about" style={styles.link}>
            About Us
          </Link>
          <Link to="/ourteam" style={styles.link}>
            Our Team
          </Link>
          <Link to="/privacy" style={styles.link}>
            Privacy Policy
          </Link>
          <Link to="/terms" style={styles.link}>
            Terms & Conditions
          </Link>
        </div>

        {/* Contact */}
        <div style={styles.contact}>
          <h3 style={styles.heading}>Contact</h3>

          <p style={styles.contactItem}>
            📧 support@aicareerpilot.com
          </p>

          <p style={styles.contactItem}>
           📞 +91 98765 43210
          </p>

          <p style={styles.contactItem}>
            📍 Gujarat, India
          </p>
        </div>

      </div>

      <hr style={styles.line} />
      
      {/* bottom */}
      <div style={styles.bottom}>
        <p>
          © 2026 AI Career Coach Pilot. All Rights Reserved.
        </p>

        <div style={styles.social}>
          <a href="" style={styles.linkInline}>LinkedIn</a>|
          <a href="" style={styles.linkInline}>GitHub</a>|
          <a href="" style={styles.linkInline}>Twitter</a>|
          <a href="" style={styles.linkInline}>Instagram</a> 
        </div>
      </div>

    </footer>
  );
}

const styles = {

  footer: {
    background: "#0F172A",
    color: "#ffffff",
    padding: "60px 80px",
  },

  container: {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr",
  columnGap: "80px",
  rowGap: "40px",
  maxWidth: "1400px",
  margin: "auto",
  alignItems: "start",
},

  logo: {
    fontSize: "30px",
    marginBottom: "15px",
    color: "#ffffff",
  },

  description: {
    color: "#CBD5E1",
    lineHeight: "28px",
    fontSize: "15px",
  },

  heading: {
    marginBottom: "20px",
    color: "#dcb431",
  },

  link: {
  display: "block",
  color: "#CBD5E1",
  textDecoration: "none",
  marginBottom: "14px",
  transition: "0.3s",
  cursor: "pointer",
  fontSize: "15px",
},

  line: {
    margin: "10px 0px",
    borderColor: "#334155",
    marginBottom: "15px",
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "auto",
   
  },

  linkInline: {
  color: "#CBD5E1",
  textDecoration: "none",
  marginLeft: "10px",
  fontSize: "15px",
  },

  social: {
    display: "flex",
    gap: "10px",
  },
  contact: {
  textAlign: "center",
  alignItems: "center",
  },

  contactItem: {
  color: "#CBD5E1",
  marginBottom: "14px",
  lineHeight: "24px",
  fontSize: "15px",
  },
};
