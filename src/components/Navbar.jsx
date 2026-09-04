import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, LogOut, Building2, User, Sun, Moon, Bell, MessageSquare, Search } from 'lucide-react';

export default function Navbar({ dayMode = false, onToggleDayMode }) {
  const { user, logout } = useAuth();

  return (
    <header className="crvm-topbar sales-topbar">
      {/* Brand / Logo */}
      <div className="sales-topbar-heading">
        <div className="sales-mobile-mark"><Building2 className="w-4 h-4" /></div>
        <div>
          <h1>Sales overview</h1>
          <p>CRVM customer, sales lead and vendor activity</p>
        </div>
      </div>
      <div className="sales-topbar-actions">
        <div className="sales-quick-links">
          <a href="mailto:sales@meetyourneeds.in" title="Lead inquiries"><Mail className="w-3.5 h-3.5" /><span>sales@meetyourneeds.in</span></a>
          <a href="tel:+917207929888" title="Direct sales hotline"><Phone className="w-3.5 h-3.5" /><span>+91 72079 29888</span></a>
        </div>
        <button className="sales-circle-button" type="button" title="Search"><Search className="w-4 h-4" /></button>
        <button className="sales-circle-button" type="button" title="Notifications"><Bell className="w-4 h-4" /></button>
        <button className="sales-circle-button" type="button" title="Messages"><MessageSquare className="w-4 h-4" /></button>
        <button
          type="button"
          onClick={onToggleDayMode}
          className="vm-theme-toggle sales-theme-toggle"
          title={dayMode ? 'Switch to night mode' : 'Switch to day mode'}
          aria-label={dayMode ? 'Switch to night mode' : 'Switch to day mode'}
        >
          {dayMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{dayMode ? 'Night' : 'Day'}</span>
        </button>
        <div className="sales-user-chip">
          <div className="sales-avatar"><User className="w-4 h-4" /></div>
          <div><strong>{user?.name || 'MYN Admin'}</strong><small>{user?.role || 'Admin'}</small></div>
        </div>
        <button onClick={logout} className="sales-logout" title="Sign Out"><LogOut className="w-4 h-4" /></button>
      </div>
    </header>
  );
}
