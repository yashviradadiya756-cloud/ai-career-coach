import React from "react";
import { useState } from "react";

export default function ContactUs() {
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    alert("✅ Thank you! Your message has been sent successfully.");
  
    e.target.reset();
  };

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Contact Us</h1>
        <p style={styles.heroText}>
          We'd love to hear from you. Whether you have questions, feedback, or
          need assistance, our team is here to help.
        </p>
      </section>

      {/* Form */}
      <section style={styles.formSection}>
        <div style={styles.formBox}>
          <h2 style={styles.heading}><b>Send a Message</b></h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
            />

            <input
              type="email"
              placeholder="Email Address"
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Subject"
              style={styles.input}
            />

            <textarea
              placeholder="Your Message"
              rows="6"
              style={styles.textarea}
            ></textarea>

            <button style={styles.button}>
              Send Message
            </button>
          </form>
          
        </div>
      </section>
      
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f8fafc",
    color: "#1e293b",
  },

  hero: {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "white",
    textAlign: "center",
    padding: "80px 20px",
  },

  heroTitle: {
    fontSize: "48px",
    marginBottom: "15px",
  },

  heroText: {
    maxWidth: "700px",
    margin: "auto",
    lineHeight: "30px",
    fontSize: "18px",
  },

  cardSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "25px",
    padding: "60px 80px",
  },

  card: {
    background: "#fff",
    borderRadius: "15px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,.08)",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "15px",
  },

  formSection: {
    padding: "20px 80px 60px",
  },

  formBox: {
    maxWidth: "800px",
    margin: "auto",
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,.08)",
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#2563eb",
  },

  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "20px",
    resize: "vertical",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  faqSection: {
    padding: "20px 80px 60px",
  },

  faq: {
    background: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 12px rgba(0,0,0,.06)",
  },

  mapSection: {
    padding: "20px 80px 80px",
  },

  map: {
    border: "none",
    borderRadius: "15px",
  },
};