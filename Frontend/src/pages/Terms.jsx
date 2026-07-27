import React from 'react';

const TermsConditions = () => {
  const rules = [
    { t: 'Acceptance of Terms', d: 'Accessing platform services binds authentication keys instantly to standard usage validation paths.' },
    { t: 'Eligibility', d: 'Designed strictly for educational processing streams and individual self-guided learner portfolios.' },
    { t: 'User Accounts', d: 'Securing structural access codes remains user-side responsibility. Report multi-endpoint compromise vectors immediately.' },
    { t: 'Acceptable Use', d: 'Automated request loops or reverse compiling scripts aimed at computational endpoints remain prohibited.' },
    { t: 'Subscription Plans', d: 'Premium feature expansions operate on continuous renewal configurations clearable within account configurations.' },
    { t: 'Refund Policy', d: 'Transactions undergo handling criteria detailed within platform parameter sheets depending on resource runtimes.' },
    { t: 'Intellectual Property', d: 'Algorithmic assessment structures remain internal assets. Generated user review docs stay yours completely.' },
    { t: 'Termination', d: 'Operational licenses can face suspension if structural pipeline exploits are verified on account operations.' },
    { t: 'Limitation of Liability', d: 'System evaluations serve as advice. Structural recruitment decisions rest with candidate companies.' },
    { t: 'Changes to Terms', d: 'We hold authorization to modify interface configurations. Continued access confirms validation.' }
  ];

  return (
    <div className="bg-[#0a1128] text-white min-vh-100 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#ffc107] mb-2">Terms & Conditions</h1>
          <p className="text-gray-400 text-sm">Effective: 2026 Architectural Cycle</p>
        </div>

        <div className="space-y-6">
          {rules.map((rule, i) => (
            <div key={i} className="p-6 bg-[#101f42] border-l-4 border-[#ffc107] rounded-r-xl shadow-md">
              <h4 className="text-lg font-bold text-white mb-2">
                <span className="text-[#ffc107] mr-2">{i + 1}.</span> {rule.t}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed pl-6">{rule.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;