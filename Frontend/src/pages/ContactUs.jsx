import React, { useState } from "react";
import { sendContactMessage } from "../api/contactApi";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };


  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // Frontend validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await sendContactMessage(formData);

      if (response.success) {
        setSuccess(
          "Thank you! Your message has been sent successfully."
        );

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      console.error("Contact form error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.page}>

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Contact Us
        </h1>

        <p style={styles.heroText}>
          We'd love to hear from you. Whether you have
          questions, feedback, or need assistance, our
          team is here to help.
        </p>
      </section>


      {/* =================================================
          FORM SECTION
      ================================================= */}

      <section style={styles.formSection}>
        <div style={styles.formBox}>

          <h2 style={styles.heading}>
            <b>Send a Message</b>
          </h2>


          {/* SUCCESS MESSAGE */}

          {success && (
            <div style={styles.successMessage}>
              ✅ {success}
            </div>
          )}


          {/* ERROR MESSAGE */}

          {error && (
            <div style={styles.errorMessage}>
              ❌ {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />


            {/* EMAIL */}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />


            {/* SUBJECT */}

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />


            {/* MESSAGE */}

            <textarea
              name="message"
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              disabled={loading}
            />


            {/* BUTTON */}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Message"}
            </button>

          </form>

        </div>
      </section>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f8fafc",
    color: "#1e293b",
    minHeight: "100vh",
  },

  hero: {
    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",
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

  formSection: {
    padding: "40px 20px 60px",
  },

  formBox: {
    maxWidth: "800px",
    margin: "auto",
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,.08)",
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#2563eb",
    fontSize: "28px",
  },

  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
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
    outline: "none",
  },

  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "8px",
    fontSize: "16px",
    width: "100%",
    fontWeight: "600",
  },

  successMessage: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },

  errorMessage: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },
};