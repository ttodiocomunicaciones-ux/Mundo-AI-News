import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 bg-white border-b border-gray-100 sticky top-0 z-40 bg-opacity-95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tighter">
            MUNDO<span className="text-gray-400">.AI</span>
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            Global Intelligence Briefing
          </p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs font-mono text-gray-500">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;