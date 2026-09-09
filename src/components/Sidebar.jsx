import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  Search,
  Building2,
  Linkedin,
  KanbanSquare,
  FileText,
  Zap,
  Settings,
  Flame,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads & Call Guide', icon: Phone },
  { path: '/linkedin', label: 'LinkedIn Shortlist', icon: Linkedin },
  { path: '/vendors', label: 'Vendor Register', icon: Building2 },
  { path: '/reports', label: 'Daily Report', icon: FileText },
  { path: '/training', label: 'Training', icon: BookOpen },
  { path: '/pipeline', label: 'CRM Pipeline', icon: KanbanSquare },
  { path: '/make-scenarios', label: 'Synchronize', icon: Zap },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="crvm-sidebar sales-sidebar">
      {/* Main Navigation */}
      <div className="sales-sidebar-main">
        <div className="sales-brand-lockup">
          <div className="sales-brand-mark"><Building2 className="w-5 h-5" /></div>
          <div>
            <strong>CRVM</strong>
            <span>SUIT</span>
          </div>
        </div>
        <div>
          <p className="sales-nav-caption">Workspace</p>
          <nav className="sales-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sales-nav-item ${isActive ? 'active' : ''} ${
                      isActive
                        ? ''
                        : ''
                    }`
                  }
                >
                  <div className="sales-nav-label">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="sales-nav-badge">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sales-focus-card">
          <div className="sales-focus-title">
            <Flame className="w-4 h-4" />
            <span>CRVM focus</span>
          </div>
          <ul className="sales-focus-list">
            <li><i className="focus-dot dot-blue" /><span>Turnkey fit-out</span>
            </li>
            <li><i className="focus-dot dot-cyan" /><span>Commercial & retail</span>
            </li>
            <li><i className="focus-dot dot-green" /><span>Corporate renovation</span>
            </li>
            <li><i className="focus-dot dot-purple" /><span>Signage & branding</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Support / Contact Card */}
      <div className="sales-sidebar-footer">
        <div className="sales-upgrade-card">
          <div className="sales-upgrade-icon">✦</div>
          <p>Meet Your Needs</p>
          <small>PAN India turnkey delivery</small>
          <a
            href="tel:+917207929888"
            className="sales-call-button"
          >
            <span>Call sales team</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
