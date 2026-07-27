import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-[#0a1128] text-white min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24">
          <div className="lg:w-1/2 space-y-6">
            <span className="text-[#ffc107] font-semibold tracking-widest uppercase text-sm px-3 py-1 bg-[#101f42] rounded-full border border-[#1e2d5a]">Platform Identity</span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Empowering Careers with <span className="text-[#ffc107]">Artificial Intelligence</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our platform blends advanced machine learning frameworks with interactive roadmaps to deliver industrial-grade career mentoring tailored perfectly for student environments.
            </p>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md aspect-video md:h-72 rounded-2xl gradient-avatar-bg border border-[#1e2d5a] flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute w-60 h-60 bg-[#ffc107] opacity-[0.03] rounded-full blur-3xl -top-10 -left-10"></div>
              <div className="text-center p-6 space-y-2">
                <span className="text-6xl animate-bounce duration-1000 block">🤖</span>
                <span className="text-white font-bold text-lg block">AI Core Processing</span>
                <span className="text-gray-500 text-xs block">Active Node Cluster</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 bg-[#101f42] border border-[#1e2d5a] rounded-2xl shadow-xl hover-card-grow">
            <div className="w-12 h-12 rounded-xl bg-[#0a1128] border border-[#1e2d5a] flex items-center justify-center mb-6 text-[#ffc107] text-xl font-bold">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Help students discover the right career path using AI, closing real-time repository gaps with accurate automated feedback models.
            </p>
          </div>
          <div className="p-8 bg-[#101f42] border border-[#1e2d5a] rounded-2xl shadow-xl hover-card-grow">
            <div className="w-12 h-12 rounded-xl bg-[#0a1128] border border-[#1e2d5a] flex items-center justify-center mb-6 text-[#ffc107] text-xl font-bold">👁️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Become the world's most trusted AI career guidance platform, creating open modular roadmaps easily accessible across standard web frames.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Us</h2>
            <div className="w-16 h-1 bg-[#ffc107] mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Career Assessment', desc: 'Evaluates baseline competencies to map perfect modern roles.' },
              { title: 'Resume Analyzer', desc: 'Instantly identifies structural formatting gaps.' },
              { title: 'Interview Preparation', desc: 'Simulates technical prompt tracks with dynamic routing.' },
              { title: 'Skill Gap Analysis', desc: 'Flags missing tools based on standard market changes.' },
              { title: 'Personalized Roadmaps', desc: 'Dynamic learning frameworks custom-tuned to your pace.' },
              { title: 'AI Chat Assistant', desc: '24/7 technical chat layer ready to process code queries.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#101f42] border border-[#1e2d5a] rounded-xl hover:border-[#ffc107] hover-card-grow group">
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#ffc107] transition-colors">{item.title}</h4>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center bg-glass-navy border border-[#1e2d5a] rounded-2xl p-8 mb-24 shadow-2xl">
          {[
            { num: '10,000+', lbl: 'Students Guided' },
            { num: '500+', lbl: 'Career Paths' },
            { num: '95%', lbl: 'User Satisfaction' },
            { num: '24/7', lbl: 'AI Support' }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-[#ffc107]">{stat.num}</h2>
              <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase">{stat.lbl}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div>
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Core Values</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            {['Innovation', 'Transparency', 'Student First', 'Privacy', 'Continuous Learning'].map((value, idx) => (
              <div key={idx} className="p-4 bg-[#101f42] border border-[#1e2d5a] rounded-xl text-sm font-bold text-[#ffc107] tracking-wide hover:bg-[#1e2d5a] transition-all">
                {value}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;