import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Linkedin,
  KanbanSquare,
  TrendingUp,
  DollarSign,
  PhoneCall,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Plus,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import LeadModal from '../components/LeadModal';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes] = await Promise.all([
        api.get('/leads/stats'),
        api.get('/leads?limit=6')
      ]);
      setStats(statsRes.data);
      setRecentLeads(leadsRes.data.leads || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartRows = (stats?.dailyCounts || []).slice(-14);
  const chartMax = Math.max(1, ...chartRows.map((row) => Number(row.salesLeads || 0) + Number(row.vendors || 0)));

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getCategoryBadge = (cat) => {
    const map = {
      turnkey_fitout: { label: 'Turnkey Fit-Out', color: 'bg-blue-900/60 text-blue-300 border-blue-700' },
      commercial_interior: { label: 'Commercial Works', color: 'bg-cyan-900/60 text-cyan-300 border-cyan-700' },
      office_renovation: { label: 'Office Renovation', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700' },
      signage_branding: { label: 'Signage & Branding', color: 'bg-purple-900/60 text-purple-300 border-purple-700' },
      facility_amc: { label: 'Facility AMC', color: 'bg-amber-900/60 text-amber-300 border-amber-700' },
    };
    const item = map[cat] || { label: cat, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
        {item.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const map = {
      new: { label: 'New Lead', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      contacted: { label: 'Contacted', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      discussion: { label: 'Discussion', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      site_visit_scheduled: { label: 'Site Visit', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      boq_sent: { label: 'BOQ Sent', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
      negotiation: { label: 'Negotiation', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
      won: { label: 'Won / Awarded', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      lost: { label: 'Lost', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    };
    const item = map[status] || { label: status, color: 'bg-slate-800 text-slate-300' };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${item.color}`}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 border border-blue-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>CRVM — Customer Relationship & Vendor Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Customer, Sales Lead & Vendor Dashboard
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Turnkey Interior Fit-Outs • Office Renovations • Commercial Works • Signage & Branding Solutions across India.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lead</span>
            </button>
            <Link
              to="/google-leads"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Google Leads Finder</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pipeline Leads"
          value={stats?.totalLeads || '0'}
          subtitle="Google & LinkedIn Aggregated"
          icon={Users}
          color="blue"
          trend="+18% this month"
        />

        <StatsCard
          title="Estimated Pipeline Value"
          value={formatCurrency(stats?.pipelineValue || 0)}
          subtitle="Active Turnkey & Renovation BOQs"
          icon={DollarSign}
          color="emerald"
          trend="High Potential"
        />

        <StatsCard
          title="Google Discovered Leads"
          value={stats?.googleLeads || '0'}
          subtitle="Commercial Hubs & Tech Parks"
          icon={Search}
          color="cyan"
        />

        <StatsCard
          title="LinkedIn Outreach Status"
          value={`${stats?.linkedinStats?.connected || 0} Connected`}
          subtitle={`${stats?.linkedinStats?.messaged || 0} Messaged / ${stats?.linkedinStats?.replied || 0} Replied`}
          icon={Linkedin}
          color="purple"
          trend="Safe Daily Cap: 25"
        />
      </div>

      {/* Daily vendor and sales-lead intake */}
      <div className="sales-intake-grid">
      <section className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Daily Intake Monitor</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">Vendors and sales leads added by date</h3>
            <p className="text-xs text-slate-400 mt-1">Live counts from Google sync, Make.com, and CRM activity.</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-cyan-300"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Vendors: {stats?.vendorCount || 0}</span>
            <span className="flex items-center gap-1.5 text-blue-300"><span className="w-2 h-2 rounded-full bg-blue-400" /> Sales leads: {stats?.salesLeadCount || 0}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="py-2.5 pr-4 font-semibold">Date</th>
                <th className="py-2.5 px-4 font-semibold text-cyan-300">Vendors added</th>
                <th className="py-2.5 px-4 font-semibold text-blue-300">Sales leads added</th>
                <th className="py-2.5 pl-4 font-semibold">Total activity</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const counts = new Map((stats?.dailyCounts || []).map((row) => [row.date, row]));
                return Array.from({ length: 14 }, (_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (13 - index));
                  const key = date.toISOString().slice(0, 10);
                  const row = counts.get(key) || { vendors: 0, salesLeads: 0 };
                  const vendors = Number(row.vendors || 0);
                  const salesLeads = Number(row.salesLeads || 0);
                  return (
                    <tr key={key} className="border-b border-slate-800/70 last:border-0">
                      <td className="py-3 pr-4 text-slate-300 font-medium whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-slate-500" />{date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </td>
                      <td className="py-3 px-4 text-cyan-300 font-bold">{vendors}</td>
                      <td className="py-3 px-4 text-blue-300 font-bold">{salesLeads}</td>
                      <td className="py-3 pl-4 text-slate-400">{vendors + salesLeads}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="sales-chart-rail" aria-label="Performance charts">
        <div className="sales-chart-card">
          <div className="sales-chart-head"><div><h3>Average items per sale</h3><p><strong>{stats?.salesLeadCount || 0}</strong> live sales leads</p></div><button type="button" aria-label="Open chart">↗</button></div>
          <div className="sales-dot-chart" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => {
              const row = chartRows[index] || {};
              const value = Number(row.salesLeads || 0) + Number(row.vendors || 0);
              return <span key={index} style={{ '--bar': `${Math.max(8, Math.round((value / chartMax) * 76))}%` }}><i /></span>;
            })}
          </div>
          <div className="sales-chart-axis"><span>14 days</span><span>Live intake</span></div>
        </div>
        <div className="sales-chart-card">
          <div className="sales-chart-head"><div><h3>Average sale value</h3><p><strong>{formatCurrency(stats?.pipelineValue || 0)}</strong> pipeline value</p></div><button type="button" aria-label="Open chart">↗</button></div>
          <div className="sales-bars" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => {
              const row = chartRows[index] || {};
              const value = Number(row.salesLeads || 0) + Number(row.vendors || 0);
              return <span key={index} style={{ '--bar': `${Math.max(10, Math.round((value / chartMax) * 84))}%` }}><i /><b /></span>;
            })}
          </div>
          <div className="sales-chart-axis"><span>1</span><span>7</span><span>14</span><span>Daily</span></div>
        </div>
        <div className="sales-chart-card sales-country-card">
          <div className="sales-chart-head"><div><h3>Most active markets</h3><p>Live locations in your CRM</p></div><button type="button" aria-label="More chart options">⋮</button></div>
          <div className="sales-map-dots" aria-hidden="true">{Array.from({ length: 70 }, (_, index) => <i key={index} style={{ opacity: .18 + ((index * 7) % 6) / 10 }} />)}</div>
          <div className="sales-market-pills"><span><b>#1</b> India <small>{stats?.totalLeads || 0} records</small></span><span><b>#2</b> South India <small>CRM activity</small></span><span><b>#3</b> PAN India <small>Vendor network</small></span></div>
        </div>
      </aside>
      </div>

      {/* 4 Focused Core Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
            1
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Turnkey Fit-Out</h4>
            <p className="text-[11px] text-slate-400">Corporate & BFSI Turnkey execution</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black">
            2
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Commercial Interiors</h4>
            <p className="text-[11px] text-slate-400">Retail showrooms & branch works</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
            3
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Office Renovations</h4>
            <p className="text-[11px] text-slate-400">Civil, HVAC & layout revamp</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black">
            4
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Signage & Branding</h4>
            <p className="text-[11px] text-slate-400">Architectural & retail signage</p>
          </div>
        </div>
      </div>

      {/* Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent High-Intent Leads */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Active High-Priority Leads</h3>
              <p className="text-xs text-slate-400">Commercial projects in active discussion or site visit</p>
            </div>
            <Link
              to="/pipeline"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>View Full Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No leads recorded yet. Use Google Finder or Add Lead.</p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white">{lead.company}</h4>
                      {getCategoryBadge(lead.category)}
                    </div>
                    <p className="text-xs text-slate-300 flex items-center space-x-2">
                      <span>👤 {lead.name} {lead.title ? `(${lead.title})` : ''}</span>
                      <span>•</span>
                      <span>📍 {lead.city || 'India'}</span>
                    </p>
                    <p className="text-xs text-slate-400 italic line-clamp-1">{lead.notes}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right sm:block">
                      <p className="text-xs font-bold text-emerald-400">
                        {formatCurrency(lead.estimatedValue)}
                      </p>
                      {getStatusBadge(lead.status)}
                    </div>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-2 bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors"
                        title={`Call ${lead.phone}`}
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Automation & Safety Status */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-900/40">
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>LinkedIn Account Safety Shield</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Account: contact.meetyourneeds@gmail.com</h4>
            <p className="text-xs text-slate-400 mb-4">
              Autonomous throttle active. Keeps daily connection requests capped at 25/day with randomized human delays.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Daily Limit Quota</span>
                <span className="text-blue-400">{stats?.linkedinStats?.messaged || 0} / 25 Sent</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, ((stats?.linkedinStats?.messaged || 0) / 25) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Safety Guard Active</span>
              </span>
              <Link to="/linkedin" className="text-blue-400 hover:text-blue-300 font-bold">
                Manage Queue →
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Instant Sales Alert Routing
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              New high-intent leads and scheduled site visits are automatically notified to:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-blue-300 mb-3">
              ✉️ sales@meetyourneeds.in
            </div>
            <Link
              to="/make-scenarios"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span>View Make.com Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Lead Creation Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchDashboardData}
      />
    </div>
  );
}
