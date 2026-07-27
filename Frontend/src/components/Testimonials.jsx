import React from 'react';

export default function Testimonials() {
  const reviews = [
    { quote: "This tool pinpointed exactly why I wasn't landing Senior roles. Fixed my skill roadmap, applied, and secured a placement in 3 weeks.", author: "Alex M.", role: "Full Stack developer" },
    { quote: "The 30-60-90 day planning structure felt like having a real developer sitting right next to me.", author: "Sarah P.", role: "Web developer" }
  ];

  return (
    <section id="testimonials" style={styles.section}>
      <h2 style={styles.title}>Validated by High-Growth Professionals</h2>
      <div style={styles.container}>
        {reviews.map((r, idx) => (
          <div key={idx} style={styles.bubble}>
            <p style={styles.text}>"{r.quote}"</p>
            <div style={styles.meta}>
              <strong>{r.author}</strong> — <span style={{color: '#64748b'}}>{r.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 40px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '40px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  bubble: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    borderLeft: '4px solid #2563eb',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
  },
  text: {
    fontStyle: 'italic',
    fontSize: '16px',
    marginBottom: '12px'
  },
  meta: {
    fontSize: '14px'
  }
};