import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, Globe, ShieldCheck, LogOut, Building2, User, Sun, Moon } from 'lucide-react';

export default function Navbar({ dayMode = false, onToggleDayMode }) {
  const { user, logout } = useAuth();

  return (
    <header className="crvm-topbar h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand / Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-lg tracking-tight text-white">
              CRVM <span className="text-blue-400 font-semibold">Customer & Vendor Management</span>
            </h1>
            <span className="bg-blue-900/60 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-700/50 font-medium">
              PAN India
            </span>
          </div>
          <p className="text-xs text-slate-400">B@YY@ Automation Labs | Customer Relationship & Vendor Management</p>
        </div>
      </div>

      {/* Quick Contact & Company Badges */}
      <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-300">
        <a
          href="tel:+917207929888"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors text-emerald-400 font-semibold"
          title="Direct Sales Hotline"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>+91-72079 29888</span>
        </a>

        <a
          href="mailto:sales@meetyourneeds.in"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors text-blue-300"
          title="Lead Inquiries"
        >
          <Mail className="w-3.5 h-3.5 text-blue-400" />
          <span>sales@meetyourneeds.in</span>
        </a>

        <a
          href="https://www.meetyourneeds.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>www.meetyourneeds.in</span>
        </a>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onToggleDayMode}
          className="vm-theme-toggle"
          title={dayMode ? 'Switch to night mode' : 'Switch to day mode'}
          aria-label={dayMode ? 'Switch to night mode' : 'Switch to day mode'}
        >
          {dayMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{dayMode ? 'Night' : 'Day'}</span>
        </button>
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.name || 'MYN Sales'}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role || 'Team'}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
            <User className="w-4 h-4" />
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
