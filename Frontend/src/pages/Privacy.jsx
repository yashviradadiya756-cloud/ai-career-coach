import React from 'react';

const PrivacyPolicy = () => {
  const sections = [
    { i: '📄', t: 'Introduction', d: 'We hold complete dedication toward safeguarding active student system credentials and localized text metadata.' },
    { i: '🔒', t: 'Information We Collect', d: 'Secure repositories, structural parameters within files, text prompts, and standard device log details.' },
    { i: '⚙️', t: 'How We Use Information', d: 'Exclusively utilized to fine-tune recommendation layers and compute immediate skill gaps.' },
    { i: '🍪', t: 'Cookies', d: 'Basic operational tokens are maintained to keep session authentications robust during compilation loops.' },
    { i: '🛡️', t: 'Data Security', d: 'End-to-end transport protocol encryption safeguards asset parsing layers at every vector junction.' },
    { i: '🤝', t: 'Third-Party Services', d: 'No tracking metadata modules are shared with unauthorized advertising networks.' },
    { i: '⚖️', t: 'User Rights', d: 'Full ownership stays yours. Access summaries or correct individual profile datasets seamlessly.' },
    { i: '❌', t: 'Account Deletion', d: 'Initiate absolute node clearance inside settings to scrub all repository references permanently.' },
    { i: '🔄', t: 'Policy Updates', d: 'Any core configuration changes regarding security architectures will trigger visual alerts across system dashboards.' },
    { i: '📞', t: 'Contact Information', d: 'Queries regarding protection parameters can be routed instantly into our processing operations desk.' }
  ];

  return (
    <div className="bg-[#0a1128] text-white min-vh-100 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#ffc107] mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last Configured: July 2026</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="p-6 bg-[#101f42] border border-[#1e2d5a] rounded-xl flex items-start gap-4">
              <span className="text-3xl p-2 bg-[#0a1128] rounded-lg border border-[#1e2d5a]">{sec.i}</span>
              <div>
                <h4 className="text-lg font-bold text-[#ffc107] mb-1">{sec.t}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{sec.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;