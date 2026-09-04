import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CircleEllipsis, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LeadModal from '../components/LeadModal';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    try {
      const response = await api.get('/leads/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  useEffect(() => { load(); }, []);

  const value = (input) => Number(input || 0);
  const leads = value(stats?.totalLeads);
  const vendors = value(stats?.vendorCount);
  const google = value(stats?.googleLeads);
  const connected = value(stats?.linkedinStats?.connected);
  const messaged = value(stats?.linkedinStats?.messaged);
  const pipeline = value(stats?.pipelineValue);
  const daily = (stats?.dailyCounts || []).slice(-12);
  const maximum = Math.max(1, ...daily.map((item) => value(item.vendors) + value(item.salesLeads)));
  const currency = pipeline ? `₹${pipeline.toLocaleString('en-IN')}` : '₹0';
  const average = leads ? (pipeline / leads).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0';
  const height = (index) => `${Math.max(12, Math.round(((value(daily[index]?.vendors) + value(daily[index]?.salesLeads)) / maximum) * 70))}%`;

  return (
    <div className="reference-dashboard">
      <section className="reference-heading">
        <div><p>CRVM SALES OVERVIEW</p><h2>Your current sales summary and activity</h2></div>
        <div className="reference-heading-actions">
          <button type="button" onClick={() => setIsModalOpen(true)} className="reference-primary"><Plus size={15} /> Add New Lead</button>
          <Link to="/google-leads" className="reference-icon-link" title="Google leads finder"><Search size={16} /></Link>
        </div>
      </section>

      <div className="reference-grid">
        <section className="reference-main-column">
          <div className="reference-top-cards">
            <article className="reference-mini-card lime"><span>New leads</span><strong>{leads.toString().padStart(2, '0')}</strong><small>Added to CRM</small></article>
            <article className="reference-mini-card navy"><span>Vendor records</span><strong>{vendors.toString().padStart(2, '0')}</strong><small>Verified suppliers</small></article>
            <article className="reference-mini-card white"><span>Sales orders</span><strong>{connected}</strong><small>LinkedIn connected</small></article>
          </div>

          <article className="reference-target-card">
            <div className="reference-card-title"><span>Daily sales target</span><CircleEllipsis size={21} /></div>
            <div className="reference-progress"><i style={{ width: `${Math.min(100, leads ? 68 : 0)}%` }} /><b /></div>
            <div className="reference-target-data"><strong>{leads} live records</strong><span>{vendors} vendors and {google} Google leads in CRVM</span></div>
          </article>

          <div className="reference-profit-row">
            <article className="reference-profit"><span>Pipeline value</span><strong>{currency}</strong><small>Current active opportunities</small><i className="reference-arrow">↗</i></article>
            <article className="reference-profit right"><span>Average lead value</span><strong>₹{average}</strong><small>Calculated from active pipeline</small></article>
          </div>

          <article className="reference-year-card">
            <div className="reference-card-title"><span>CRM activity this year</span><button type="button">+ Show More</button><ArrowUpRight size={18} /></div>
            <div className="reference-line-chart" aria-label="Lead activity chart"><svg viewBox="0 0 600 140" preserveAspectRatio="none" role="img"><path className="reference-dashed-line" d="M0 98 C42 68,62 115,102 87 S164 79,202 95 S260 55,304 86 S360 58,400 81 S462 71,510 84 S560 54,600 70" /><path className="reference-live-line" d="M0 67 C35 62,52 89,83 74 S138 52,169 71 S226 84,256 57 S310 68,340 59 S396 78,426 56 S482 69,515 52 S566 59,600 31" /></svg><span className="reference-chart-pin" style={{ left: '54%' }}><b>{leads} records</b></span></div>
            <div className="reference-months">{months.map((month) => <span key={month}>{month}</span>)}</div>
            <div className="reference-bottom-metrics"><div><span>Average sale value</span><strong>₹{average}</strong><small>from live CRM data</small></div><div><span>Average items per value</span><strong>{leads ? (leads / Math.max(1, vendors || 1)).toFixed(1) : '0'}</strong><small>leads per vendor record</small></div></div>
          </article>
        </section>

        <aside className="reference-side-column">
          <article className="reference-side-card reference-dot-card"><div className="reference-card-title"><div><span>Average items per sale</span><strong>{leads || 0}</strong><small>Live CRM lead count</small></div><ArrowUpRight size={18} /></div><div className="reference-dot-bars">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--h': height(index) }} />)}</div><div className="reference-pill-axis"><span>Live</span><span>Intake</span><span>Daily</span></div></article>
          <article className="reference-side-card reference-bar-card"><div className="reference-card-title"><div><span>Average sale value</span><strong>{currency}</strong><small>Current pipeline value</small></div><ArrowUpRight size={18} /></div><div className="reference-columns">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ '--h': height(index % 12) }} />)}</div><div className="reference-number-axis"><span>1</span><span>3</span><span>5</span><span>7</span><span>9</span><span>11</span><span>Daily</span></div></article>
          <article className="reference-side-card reference-market-card"><div className="reference-card-title"><div><span>Most active markets</span><small>Vendor and customer activity</small></div><CircleEllipsis size={20} /></div><div className="reference-map" aria-hidden="true">{Array.from({ length: 170 }, (_, index) => <i key={index} />)}</div><div className="reference-market-list"><div className="market-lime"><b>#1</b><span>India <small>{leads} CRM records</small></span></div><div className="market-navy"><b>#2</b><span>South India <small>{vendors} vendor records</small></span></div><div className="market-light"><b>#3</b><span>Pan India <small>{messaged} outreach actions</small></span></div></div></article>
        </aside>
      </div>

      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSaved={load} />
    </div>
  );
}
