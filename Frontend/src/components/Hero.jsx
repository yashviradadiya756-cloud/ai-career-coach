import React from 'react';

export default function Hero() {
  return (
    <section style={styles.wrapper}>
      <header style={styles.hero}>
        <div style={styles.badge}>✨ Personalized AI Career Guidance Platform</div>
        <h1 style={styles.title}>Bridge the Gap Between Your Education & Dream Career</h1>
        <p style={styles.subtitle}>
          Traditional career counseling is time-consuming and hard to access. Map your goals, auto-analyze your engineering resumes against current ATS parameters, and generate structured learning paths using generative AI intelligence.
        </p>
        <div style={styles.ctaGroup}>
          <a href="#demo" style={styles.primaryBtn}>Try Live Demo View</a>
          <a href="#features" style={styles.secondaryBtn}>See Project Modules ↓</a>
        </div>
      </header>

      {/* Embedded Problem Statement Panel matching report */}
      <div id="problem" style={styles.problemCard}>
        <h3 style={styles.problemTitle}>📌 The Problem Statement</h3>
        <p style={styles.problemText}>
          Many students are confused about choosing the right career path because they lack proper guidance regarding skills, job opportunities, resume building, interview preparation, and career planning. Our solution introduces an AI-driven, highly central career ecosystem to provide absolute clarity.
        </p>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '60px 20px'
  },
  hero: {
    padding: "50px 20px 80px",
    textAlign: 'center',
    marginBottom: '60px'
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    background: '#eff6ff',
    color: 'var(--primary)',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px'
  },
  title: {
    fontSize: '44px',
    fontWeight: '800',
    letterSpacing: '-1px',
    lineHeight: '1.2',
    color: 'var(--dark)',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--gray)',
    marginBottom: '35px',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto 35px auto'
  },
  ctaGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px'
  },
  primaryBtn: {
    padding: '12px 24px',
    background: 'var(--primary)',
    color: '#ffffff',
    borderRadius: '6px',
    fontWeight: '500',
    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
  },
  secondaryBtn: {
    padding: '12px 24px',
    background: '#ffffff',
    color: 'var(--dark)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontWeight: '500'
  },
  problemCard: {
    background: '#fff3cd',
    borderLeft: '5px solid #ffc107',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '20px',
    textAlign: 'left'
  },
  problemTitle: {
    color: '#856404',
    fontSize: '18px',
    marginBottom: '8px',
    fontWeight: '700'
  },
  problemText: {
    color: '#856404',
    fontSize: '15px',
    lineHeight: '1.6'
  }
};