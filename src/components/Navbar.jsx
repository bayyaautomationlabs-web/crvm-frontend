import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, LogOut, Building2, User, Bell, MessageSquare, Search } from 'lucide-react';

export default function Navbar() {
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
        <div className="sales-user-chip">
          <div className="sales-avatar"><User className="w-4 h-4" /></div>
          <div><strong>{user?.name || 'MYN Admin'}</strong><small>{user?.role || 'Admin'}</small></div>
        </div>
        <button onClick={logout} className="sales-logout" title="Sign Out"><LogOut className="w-4 h-4" /></button>
      </div>
    </header>
  );
}
