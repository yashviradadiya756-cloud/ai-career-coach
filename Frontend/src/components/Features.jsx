import React from 'react';

export default function Features() {
  const objectives = [
    { icon: '🎯', title: 'Smart Recommendations', desc: 'Suggest career paths dynamically based on user engineering skills, interests, and background variables.' },
    { icon: '🗺️', title: 'Personalized Roadmaps', desc: 'Generate precise, time-bound learning roadmaps to acquire missing knowledge modules efficiently.' },
    { icon: '📄', title: 'AI Resume Analytics', desc: 'Scan raw layouts, detect structure scores, and extract instant alignment metrics against target industries.' },
    { icon: '🎙️', title: 'AI Mock Interview', desc: 'Generate custom evaluation questions matching your focus areas to build robust confidence.' },
    { icon: '🎓', title: 'Course Interception', desc: 'Identify critical certifications and online courses to target verified technological skill gaps.' },
    { icon: '📈', title: 'Progress Tracking', desc: 'Centralized analytics dashboards to systematically monitor daily career readiness milestones.' }
  ];

  return (
    <section id="features" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.textCenter}>
          <h2 style={styles.sectionTitle}>Platform core Modules & Objectives</h2>
          <p style={styles.sectionSubtitle}>Designed and developed to deliver high-quality, continuous online career advising.</p>
        </div>
        <div style={styles.grid}>
          {objectives.map((obj, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.icon}>{obj.icon}</div>
              <h3 style={styles.cardTitle}>{obj.title}</h3>
              <p style={styles.cardDesc}>{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 20px',
    background: '#ffffff',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  textCenter: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--dark)'
  },
  sectionSubtitle: {
    color: 'var(--gray)',
    fontSize: '16px',
    marginTop: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px'
  },
  card: {
    background: 'var(--light)',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  icon: {
    fontSize: '32px',
    marginBottom: '15px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--dark)',
    marginBottom: '10px'
  },
  cardDesc: {
    fontSize: '14px',
    color: 'var(--gray)',
    lineHeight: '1.6'
  }
};