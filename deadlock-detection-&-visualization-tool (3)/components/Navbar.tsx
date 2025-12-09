
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Detector', path: '/detector' },
    { name: 'RAG Viz', path: '/rag' },
    { name: 'WAG Viz', path: '/wag' },
    { name: 'About', path: '/about' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col shadow-[0_0_20px_rgba(0,200,255,0.15)]">
      {/* University Header */}
      <div className="bg-[#050810] border-b border-white/5 py-2 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
        <h1 className="text-xs md:text-sm font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 uppercase font-sans">
          Lovely Professional University
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="glass-panel border-b-0 border-t border-white/5 backdrop-blur-xl bg-cyber-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,200,255,0.4)] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-10 group-hover:translate-x-12 transition-transform duration-700"></div>
                 <span className="text-white font-bold text-xl">D</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-wider text-lg leading-none">
                  DEADLOCK<span className="text-neon-cyan">.AI</span>
                </span>
                <span className="text-[10px] text-neon-purple tracking-widest uppercase opacity-80">System Visualizer</span>
              </div>
            </div>
            <div className="flex space-x-1 sm:space-x-4">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? 'text-white bg-white/5 border border-neon-blue/30 shadow-[0_0_15px_rgba(0,200,255,0.1)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
