import React from 'react';

export default function ComingSoon({ pageTitle }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center max-w-xl mx-auto mt-12">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-pulse">
        ⚙️
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
      <div className="w-24 h-1 bg-gray-200 mx-auto my-4 rounded-full"></div>
      <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">Coming Soon...</p>
      <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
        This core control console layout workspace is structurally configured. Backend database routes will bind here in Phase 2.8.
      </p>
    </div>
  );
}