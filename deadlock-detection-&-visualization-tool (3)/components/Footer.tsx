import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-bold mb-4 border-b border-neon-blue/30 pb-2 inline-block">Coffman Conditions</h3>
          <ul className="space-y-2 list-disc pl-4 marker:text-neon-pink">
            <li><strong className="text-gray-200">Mutual Exclusion:</strong> Resources cannot be shared.</li>
            <li><strong className="text-gray-200">Hold and Wait:</strong> Processes holding resources wait for others.</li>
            <li><strong className="text-gray-200">No Preemption:</strong> Resources cannot be forcibly taken.</li>
            <li><strong className="text-gray-200">Circular Wait:</strong> A closed chain of processes waiting for each other.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 border-b border-neon-green/30 pb-2 inline-block">Definitions</h3>
          <div className="space-y-3">
             <p><strong className="text-neon-blue">WAG:</strong> Wait-For Graph. A directed graph where nodes are processes and edges represent waiting status. Cycles imply deadlock.</p>
             <p><strong className="text-neon-green">RAG:</strong> Resource Allocation Graph. Shows relationship between processes and resources.</p>
          </div>
        </div>
        <div>
           <h3 className="text-white font-bold mb-4 border-b border-neon-purple/30 pb-2 inline-block">About</h3>
           <p className="mb-4">
             A visualization tool using Banker's Algorithm logic to detect deadlocks in multi-instance resource systems.
           </p>
           <p className="text-xs opacity-50">
             &copy; {new Date().getFullYear()} Deadlock Detection & Visualization Tool.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;