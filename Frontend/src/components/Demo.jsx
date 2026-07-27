import React, { useState, useEffect } from 'react';

export default function CareerCoachDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    degree: '',
    college: '',
    skills: [],
    dreamCareer: '',
    resume: null
  });

  const availableSkills = ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python', 'SQL', 'Git', 'Tailwind CSS'];

  // Automatically advance from Step 6 (AI Analysis) to Step 7 (Report)
  useEffect(() => {
    if (currentStep === 6) {
      const timer = setTimeout(() => {
        setCurrentStep(7);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleSkill = (skill) => {
    const updated = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    handleInputChange('skills', updated);
  };

  // Maps menu steps to progress percentages
  const progressPercent = { 1: 5, 2: 20, 3: 40, 4: 60, 5: 80, 6: 95, 7: 100 };

  const stepsMenu = [
    { id: 1, label: '1. Personal Info', sub: 'Name & Contact' },
    { id: 2, label: '2. Education', sub: 'Degree & Background' },
    { id: 3, label: '3. Skills', sub: 'Technical Inventory' },
    { id: 4, label: '4. Career Interest', sub: 'Dream Profession' },
    { id: 5, label: '5. Resume Upload', sub: 'ATS Parsing Engine' },
    { id: 6, label: '6. AI Analysis', sub: 'Synthesizing Profile' },
    { id: 7, label: '7. Career Report', sub: 'Actionable Insights' },
  ];

  // Global styles object
  const styles = {
    wrapper: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    heroHeader: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    badge: {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#0f172a',
      margin: '12px 0 6px 0'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '1rem',
      margin: 0
    },
    progressBarContainer: {
      width: '100%',
      maxWidth: '1000px',
      backgroundColor: '#ffffff',
      padding: '20px 24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '24px',
    },
    progressBarTrack: {
      width: '100%',
      height: '10px',
      backgroundColor: '#e2e8f0',
      borderRadius: '5px',
      overflow: 'hidden',
      marginTop: '8px'
    },
    splitWorkspace: {
      display: 'flex',
      width: '100%',
      maxWidth: '1000px',
      gap: '24px',
    },
    leftMenu: {
      width: '300px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '20px 16px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      height: 'fit-content'
    },
    menuRow: (isActive, isCompleted) => ({
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 16px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: isActive ? '#eff6ff' : 'transparent',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s ease',
    }),
    rightContent: {
      flex: 1,
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '40px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
      minHeight: '440px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    inputField: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      fontSize: '0.95rem',
      marginTop: '6px',
      marginBottom: '16px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: '#ffffff',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    secondaryBtn: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; display: inline-block; }
        .menu-hover:hover { backgroundColor: #f8fafc !important; }
      `}</style>

      {/* HERO BANNER SECTION */}
      <header style={styles.heroHeader}>
        <span style={styles.badge}>⚡ Live Simulation Engine</span>
        <h1 style={styles.title}>🚀 AI Career Coach Assessment</h1>
        <p style={styles.subtitle}>Experience how CareerPilot parses your profile vector layout branches in under 2 minutes.</p>
      </header>

      {/* TOP COMPACT PROGRESS MONITOR */}
      <div style={styles.progressBarContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <span style={{ fontWeight: '700', color: '#475569' }}>Overall Module Analysis Integration</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#2563eb' }}>{progressPercent[currentStep]}% Completed</span>
        </div>
        <div style={styles.progressBarTrack}>
          <div style={{ width: `${progressPercent[currentStep]}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.4s ease-out' }} />
        </div>
      </div>

      {/* TWO-COLUMN WORKSPACE FRAMEWORK */}
      <div style={styles.splitWorkspace}>
        
        {/* LEFT COLUMN: ACTIVE STEP SIDEBAR MENU */}
        <aside style={styles.leftMenu}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '16px', marginBottom: '8px' }}>WIZARD MAP VIEW</div>
          {stepsMenu.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button 
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                style={styles.menuRow(isActive, isCompleted)}
                className={!isActive ? 'menu-hover' : ''}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: isActive ? '#2563eb' : isCompleted ? '#16a34a' : '#1e293b' }}>
                  {step.label} {isCompleted && '✓'}
                </span>
                <span style={{ fontSize: '0.75rem', color: isActive ? '#3b82f6' : '#94a3b8', marginTop: '2px' }}>
                  {step.sub}
                </span>
              </button>
            );
          })}
        </aside>

        {/* RIGHT COLUMN: RENDERING AREA */}
        <main style={styles.rightContent}>
          <div style={{ width: '100%' }}>
            
            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700' }}>Tell us about yourself</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Provide basic coordinates to personalize your AI analytical model profiles.</p>
                
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Full Name</label>
                <input type="text" placeholder="e.g. Yashvi Patel" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} style={styles.inputField} />
                
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Email Address</label>
                <input type="email" placeholder="e.g. yashvi@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} style={styles.inputField} />
              </div>
            )}

            {/* STEP 2: EDUCATION */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700' }}>Academic Credentials</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Input your training coordinates to calculate structural baseline metrics rules.</p>
                
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Degree Program</label>
                <input type="text" placeholder="e.g. B.Tech in Computer Science" value={formData.degree} onChange={(e) => handleInputChange('degree', e.target.value)} style={styles.inputField} />
                
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>University / College</label>
                <input type="text" placeholder="e.g. Tech Institute of Engineering" value={formData.college} onChange={(e) => handleInputChange('college', e.target.value)} style={styles.inputField} />
              </div>
            )}

            {/* STEP 3: SKILLS CONFIGURATION */}
            {currentStep === 3 && (
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700' }}>Select Your Core Technical Stack</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Choose the technical platforms you are fully comfortable operating right now.</p>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '10px 0' }}>
                  {availableSkills.map(skill => {
                    const selected = formData.skills.includes(skill);
                    return (
                      <button key={skill} onClick={() => toggleSkill(skill)} style={{
                        padding: '10px 16px', borderRadius: '20px', border: '1px solid', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s ease',
                        borderColor: selected ? '#2563eb' : '#cbd5e1',
                        backgroundColor: selected ? '#eff6ff' : '#ffffff',
                        color: selected ? '#2563eb' : '#475569'
                      }}>
                        {skill} {selected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: CAREER INTEREST */}
            {currentStep === 4 && (
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700' }}>Target Core Career Goal</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Where do you see your production work output rendering long-term?</p>
                
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Dream Job Title</label>
                <input type="text" placeholder="e.g. Full-Stack Web Developer (MERN)" value={formData.dreamCareer} onChange={(e) => handleInputChange('dreamCareer', e.target.value)} style={styles.inputField} />
              </div>
            )}

            {/* STEP 5: RESUME FILE PARSER */}
            {currentStep === 5 && (
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700' }}>ATS Parser Engine Upload</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Provide a standard documentation file format to execute keyword analysis matrix passes.</p>
                
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '40px 20px', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }} onClick={() => handleInputChange('resume', 'mock_resume.pdf')}>
                  <span style={{ fontSize: '2.5rem' }}>📄</span>
                  <h4 style={{ margin: '12px 0 4px 0', color: '#1e293b' }}>{formData.resume ? 'Change Selected File' : 'Click to Upload Resume'}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Supports PDF, DOCX formatting configurations up to 5MB max.</p>
                  {formData.resume && (
                    <div style={{ marginTop: '14px', display: 'inline-block', backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                      Selected: mock_resume.pdf Ready
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 6: AI LOADER SCREEN BLOCK */}
            {currentStep === 6 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ marginBottom: '20px' }} />
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Running Analytical Vector Modules...</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                  Cross-matching technical inventory nodes against active real-world market ecosystem parameters.
                </p>
              </div>
            )}

            {/* STEP 7: DYNAMIC DIAGNOSTIC REPORT REVEAL */}
            {currentStep === 7 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '14px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎯</span>
                  <div>
                    <h4 style={{ color: '#166534', margin: 0, fontWeight: '700' }}>Evaluation Architecture Compiled</h4>
                    <p style={{ color: '#14532d', margin: '2px 0 0 0', fontSize: '0.85rem' }}>Data packets successfully mapped into live system configurations layouts.</p>
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 12px 0', fontWeight: '700' }}>Profile Diagnostic Summary:</h3>
                <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                  Hello <strong>{formData.name || 'Yashvi'}</strong>, our AI layers analyzed your structural track and noted a <strong>78% alignment index</strong> toward your target: <em>{formData.dreamCareer || 'Full-Stack Developer'}</em>.
                </p>
                <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', borderLeft: '4px solid #2563eb', fontSize: '0.9rem', color: '#475569' }}>
                  💡 <strong>Actionable Strategy Segment:</strong> Your inventory includes {formData.skills.length > 0 ? formData.skills.join(', ') : 'foundational stacks'}. We suggest patching intermediate configuration architecture gaps next week.
                </div>
              </div>
            )}

          </div>

          {/* DYNAMIC ACTION NAVIGATION FOOTER BUTTONS */}
          {currentStep <= 5 && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '32px' }}>
              {currentStep > 1 && (
                <button onClick={() => setCurrentStep(currentStep - 1)} style={styles.secondaryBtn}>
                  Previous
                </button>
              )}
              <button 
                onClick={() => setCurrentStep(currentStep + 1)} 
                style={styles.primaryBtn}
              >
                {currentStep === 5 ? 'Initiate AI Engine ⚡' : 'Next Step →'}
              </button>
            </div>
          )}

          {currentStep === 7 && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '32px' }}>
              <button onClick={() => { setCurrentStep(1); setFormData({ name: '', email: '', degree: '', college: '', skills: [], dreamCareer: '', resume: null }); }} style={styles.secondaryBtn}>
                Restart Demo
              </button>
              <button onClick={() => alert('Redirecting to absolute advanced dashboard console...')} style={{ ...styles.primaryBtn, background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
                Unlock Premium Dashboard 🚀
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}