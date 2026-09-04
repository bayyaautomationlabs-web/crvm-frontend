import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) {
  const colorMap = {
    blue: 'from-blue-600/20 to-blue-500/5 text-blue-400 border-blue-500/20',
    emerald: 'from-emerald-600/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    purple: 'from-purple-600/20 to-purple-500/5 text-purple-400 border-purple-500/20',
    amber: 'from-amber-600/20 to-amber-500/5 text-amber-400 border-amber-500/20',
    rose: 'from-rose-600/20 to-rose-500/5 text-rose-400 border-rose-500/20',
    cyan: 'from-cyan-600/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
  };

  const iconBgMap = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  return (
    <div className={`sales-stat-card sales-stat-${color} p-5 rounded-2xl bg-gradient-to-br ${colorMap[color]} border backdrop-blur-md relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${iconBgMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-black tracking-tight text-white">{value}</h3>
        {trend && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
}
