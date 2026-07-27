import React from "react";

export default function WhyChooseUs() {
const objectives = [
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.1 2 5 5.1 5 9c0 2.6 1.4 4.9 3.5 6.1V18c0 .6.4 1 1 1h5c.6 0 1-.4 1-1v-2.9C17.6 13.9 19 11.6 19 9c0-3.9-3.1-7-7-7z" fill="#2563EB"/>
      </svg>
    ),
    bg: "#EEF4FF",
    title: "AI Career Guidance",
    desc: "Receive personalized career recommendations based on your interests, skills, and future goals."
  },

  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M7 3h7l5 5v13H7V3z" stroke="#10B981" strokeWidth="2"/>
        <path d="M14 3v5h5" stroke="#10B981" strokeWidth="2"/>
      </svg>
    ),
    bg: "#ECFDF5",
    title: "Resume Analysis",
    desc: "Upload your resume and get instant AI feedback with suggestions to improve ATS scores."
  },

  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="#F97316" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" stroke="#F97316" strokeWidth="2"/>
        <circle cx="12" cy="12" r="1.5" fill="#F97316"/>
      </svg>
    ),
    bg: "#FFF7ED",
    title: "Skill Gap Detection",
    desc: "Identify missing skills and receive a customized learning roadmap for your dream career."
  },

  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M4 7h16v11H4z" stroke="#EF4444" strokeWidth="2"/>
        <path d="M9 7V5h6v2" stroke="#EF4444" strokeWidth="2"/>
      </svg>
    ),
    bg: "#FEF2F2",
    title: "Placement Preparation",
    desc: "Practice interviews, aptitude tests, and coding challenges with AI-powered guidance."
  },

  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M6 16l4-4 3 3 5-6" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M6 20h12" stroke="#8B5CF6" strokeWidth="2"/>
      </svg>
    ),
    bg: "#F3E8FF",
    title: "Track Progress",
    desc: "Monitor your learning journey through interactive dashboards and performance analytics."
  },

  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l7 3v6c0 5-3.5 9-7 11-3.5-2-7-6-7-11V5l7-3z" stroke="#0EA5E9" strokeWidth="2"/>
      </svg>
    ),
    bg: "#EFF6FF",
    title: "Trusted AI Platform",
    desc: "Secure, reliable, and privacy-focused platform designed specifically for students."
  }
];

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>
            WHY CHOOSE US
          </span>

          <h1 style={styles.heading}>
            Everything You Need to{" "}
            <span style={{ color: "#2563EB" }}>
              Build Your Career
            </span>
          </h1>

          {/* <div style={styles.line}></div> */}

          <p style={styles.subtitle}>
            Our AI-powered platform helps students discover career paths,
            improve resumes, prepare for interviews, and track learning
            progress—all in one place.
          </p>

        </div>

        <div style={styles.grid}>
          {objectives.map((item, index) => (
            <div
              key={index}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 45px rgba(0,0,0,.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,.08)";
              }}
            >
              <div style={{
                ...styles.iconBox,
                background: item.bg,
               }}>
                  {item.icon}
              </div>

              <h3 style={styles.cardTitle}>
                {item.title}
              </h3>

              <p style={styles.cardDesc}>
                {item.desc}
              </p>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
}

const styles = {

  section: {
    background: "#F8FBFF",
    padding: "120px 25px",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "80px",
  },

  badge: {
    display: "inline-block",
    background: "#E8F0FF",
    color: "#2563EB",
    padding: "10px 24px",
    borderRadius: "50px",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "1px",
    marginBottom: "25px",
  },

  heading: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "20px",
    lineHeight: "1.2",
  },

  line: {
    width: "90px",
    height: "4px",
    background: "#2563EB",
    margin: "0 auto 25px",
    borderRadius: "50px",
  },

  subtitle: {
    maxWidth: "720px",
    margin: "0 auto",
    fontSize: "18px",
    color: "#64748B",
    lineHeight: "32px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
    gap: "35px",
  },

  card: {
    background: "#fff",
    borderRadius: "22px",
    padding: "38px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    transition: ".35s",
    cursor: "pointer",
  },

 iconBox: {
  width: "72px",
  height: "72px",
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "28px",
  boxShadow: "0 8px 20px rgba(37,99,235,.12)",
},

  cardTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "18px",
  },

  cardDesc: {
    color: "#64748B",
    fontSize: "17px",
    lineHeight: "30px",
  },

};