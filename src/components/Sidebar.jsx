import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Building2,
  Linkedin,
  KanbanSquare,
  FileText,
  Zap,
  Settings,
  Flame,
  ArrowUpRight
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Executive Dashboard', icon: LayoutDashboard },
  { path: '/google-leads', label: 'Google Leads Finder', icon: Search, badge: 'Live' },
  { path: '/vendors', label: 'Vendor Management', icon: Building2, badge: 'Live' },
  { path: '/linkedin', label: 'LinkedIn Outreach', icon: Linkedin, badge: '25/day' },
  { path: '/pipeline', label: 'Kanban CRM Pipeline', icon: KanbanSquare },
  { path: '/templates', label: 'B2B Pitch Templates', icon: FileText },
  { path: '/make-scenarios', label: 'Make.com Blueprints', icon: Zap, badge: '5 Flows' },
  { path: '/settings', label: 'System Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="crvm-sidebar w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4">
      {/* Main Navigation */}
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Main Operations
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'active bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* 4 Focused Core Services Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-slate-800/90 to-slate-850 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-amber-400 font-bold mb-2">
            <Flame className="w-4 h-4" />
            <span>CRVM Core Focus</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>1. Turnkey Interior Fit-Out</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>2. Commercial & Retail Works</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>3. Corporate Renovations</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>4. Signage & Branding</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Support / Contact Card */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 text-center">
          <p className="text-[11px] text-blue-300 font-semibold mb-1">Meet Your Needs (MYN)</p>
          <p className="text-[10px] text-slate-400 mb-2">PAN India Turnkey Delivery</p>
          <a
            href="tel:+917207929888"
            className="w-full inline-flex items-center justify-center space-x-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <span>Call +91-72079 29888</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
