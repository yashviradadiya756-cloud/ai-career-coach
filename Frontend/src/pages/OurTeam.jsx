import React from 'react';

const OurTeam = () => {
  const devs = [
    { role: 'Frontend Developer', name: 'Aman Patel', skills: 'React, Tailwind, Redux' },
    { role: 'Backend Developer', name: 'Rohan Shah', skills: 'Node.js, Express, REST APIs' },
    { role: 'AI Engineer', name: 'Dr. Kabir Verma', skills: 'Python, PyTorch, LLMs' },
    { role: 'UI/UX Designer', name: 'Pooja Joshi', skills: 'Figma, Prototyping, Wireframes' },
    { role: 'Database Engineer', name: 'Siddharth Mehta', skills: 'MongoDB, PostgreSQL, Redis' },
    { role: 'QA Engineer', name: 'Neha Desai', skills: 'Jest, Selenium, Cypress' }
  ];

  return (
    <div className="bg-[#0a1128] text-white min-vh-100 py-16">
      <div className="container mx-auto px-4">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#ffc107] mb-4">Meet Our Team</h1>
          <p className="text-gray-400 max-w-xl mx-auto">The passionate people building the future of AI-powered career guidance.</p>
        </div>

        {/* Founder Section */}
        <div className="max-w-2xl mx-auto mb-20">
          <h3 className="text-2xl font-bold text-center mb-8 tracking-wider uppercase text-gray-400">Founder</h3>
          <div className="p-6 bg-[#101f42] border-2 border-[#ffc107] rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <div className="w-28 h-28 bg-[#1e2d5a] rounded-full flex items-center justify-content-center text-4xl">👑</div>
            <div className="text-center sm:text-left flex-1">
              <h4 className="text-2xl font-bold text-white">Anand Patel</h4>
              <p className="text-[#ffc107] font-medium mb-2">Founder & Lead System Architect</p>
              <p className="text-gray-400 text-sm mb-4">Visionary engineering lead focusing on structuring fast, secure automated mentoring paradigms for the new generation.</p>
              <div className="flex justify-center sm:justify-start gap-4 text-xs font-bold text-[#ffc107]">
                <span className="cursor-pointer hover:underline">GitHub</span>
                <span className="cursor-pointer hover:underline">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Team Grid */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-10 tracking-wider uppercase text-gray-400">Development Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {devs.map((member, i) => (
              <div key={i} className="p-6 bg-[#101f42] border border-[#1e2d5a] rounded-xl text-center hover:border-gray-500 transition-all duration-300">
                <div className="w-16 h-16 mx-auto bg-[#1e2d5a] rounded-full flex items-center justify-center text-2xl mb-4">👨‍💻</div>
                <h4 className="text-xl font-bold text-white">{member.name}</h4>
                <p className="text-[#ffc107] text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-400 text-xs mb-4">Skills: {member.skills}</p>
                <div className="flex justify-center gap-3 text-xs text-gray-400">
                  <span className="hover:text-[#ffc107] cursor-pointer">GH</span>
                  <span className="hover:text-[#ffc107] cursor-pointer">LI</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-10 tracking-wider uppercase text-gray-400">Strategic Advisors</h3>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { n: 'Prof. Suresh Nair', r: 'AI Research Head at IIT' },
              { n: 'Meera Kapoor', r: 'Ex-HR Director at Tech Enterprise' }
            ].map((adv, idx) => (
              <div key={idx} className="p-5 bg-[#101f42]/60 border border-[#1e2d5a] rounded-xl text-center">
                <h5 className="font-bold text-white">{adv.n}</h5>
                <p className="text-[#ffc107] text-sm">{adv.r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <div className="text-center">
          <button className="bg-[#ffc107] text-[#0a1128] font-bold px-8 py-3 rounded-xl hover:bg-amber-400 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg">
            Join Our Team
          </button>
        </div>

      </div>
    </div>
  );
};

export default OurTeam;