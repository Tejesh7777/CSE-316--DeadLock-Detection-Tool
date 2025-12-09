import React from 'react';

interface MatrixInputProps {
  rows: number;
  cols: number;
  data: number[][];
  onChange?: (row: number, col: number, val: number) => void;
  rowLabels: string[];
  colLabels: string[];
  title: string;
  color?: 'blue' | 'purple' | 'green';
  readOnly?: boolean;
}

const MatrixInput: React.FC<MatrixInputProps> = ({ 
  rows, cols, data, onChange, rowLabels, colLabels, title, color = 'blue', readOnly = false 
}) => {
  const borderColor = 
    color === 'blue' ? 'focus:border-neon-blue' : 
    color === 'purple' ? 'focus:border-neon-purple' : 
    'focus:border-neon-green';
    
  const labelColor = 
    color === 'blue' ? 'text-neon-blue' : 
    color === 'purple' ? 'text-neon-purple' :
    'text-neon-green';

  const glowClass = 
    color === 'blue' ? 'focus:shadow-[0_0_10px_rgba(0,200,255,0.3)]' :
    color === 'purple' ? 'focus:shadow-[0_0_10px_rgba(164,92,255,0.3)]' :
    'focus:shadow-[0_0_10px_rgba(0,255,157,0.3)]';

  return (
    <div className="glass-panel p-5 rounded-xl overflow-x-auto hover:border-white/20 transition-colors duration-500">
      <h3 className={`text-lg font-bold mb-4 ${labelColor} flex items-center gap-2`}>
        {title}
        {!readOnly && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>}
      </h3>
      <table className="border-collapse w-full min-w-[300px]">
        <thead>
          <tr>
            <th className="p-2"></th>
            {colLabels.map((label, i) => (
              <th key={i} className="p-2 text-slate-400 font-mono text-sm uppercase tracking-wider">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              <td className="p-2 text-slate-400 font-mono font-bold text-sm text-right pr-4">{rowLabels[r]}</td>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={`${r}-${c}`} className="p-1">
                  <input
                    type="number"
                    min="0"
                    value={data[r]?.[c] ?? 0}
                    onChange={(e) => !readOnly && onChange && onChange(r, c, parseInt(e.target.value) || 0)}
                    readOnly={readOnly}
                    className={`w-full bg-[#050810] border border-white/10 rounded-lg p-2.5 text-center text-white font-mono transition-all outline-none ${readOnly ? 'opacity-60 cursor-not-allowed text-slate-400 border-transparent bg-transparent' : `${borderColor} ${glowClass}`}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixInput;