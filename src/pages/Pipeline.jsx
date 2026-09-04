import React, { useState, useEffect } from 'react';
import {
  KanbanSquare,
  Plus,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import LeadModal from '../components/LeadModal';

const STAGES = [
  { id: 'new', label: 'New Leads', color: 'border-blue-500/50 bg-blue-950/20 text-blue-400' },
  { id: 'contacted', label: 'In Outreach', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' },
  { id: 'discussion', label: 'Discussion', color: 'border-amber-500/50 bg-amber-950/20 text-amber-400' },
  { id: 'site_visit_scheduled', label: 'Site Visit Scheduled', color: 'border-purple-500/50 bg-purple-950/20 text-purple-400' },
  { id: 'boq_sent', label: 'BOQ / Estimate Sent', color: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-400' },
  { id: 'negotiation', label: 'Negotiation', color: 'border-orange-500/50 bg-orange-950/20 text-orange-400' },
  { id: 'won', label: 'Won / Awarded', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' },
];

export default function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingLead, setEditingLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leads?limit=200');
      setLeads(res.data.leads || []);
    } catch (err) {
      console.error('Failed to fetch pipeline leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStageChange = async (leadId, newStatus) => {
    try {
      await api.put(`/leads/${leadId}`, { status: newStatus });
      fetchLeads();
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const filteredLeads = selectedCategory
    ? leads.filter(l => l.category === selectedCategory)
    : leads;

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getCategoryTag = (cat) => {
    const map = {
      turnkey_fitout: 'Turnkey Fit-Out',
      commercial_interior: 'Commercial Works',
      office_renovation: 'Renovations',
      signage_branding: 'Signage & Brand',
      facility_amc: 'Facility AMC',
    };
    return map[cat] || cat;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-1">
            <KanbanSquare className="w-4 h-4 text-blue-400" />
            <span>Commercial Fit-Out & Renovation CRM Pipeline</span>
          </div>
          <h2 className="text-2xl font-black text-white">Deal Tracking & Site Visit Pipeline</h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage prospects across each phase from discovery to site inspection and awarded turnkey projects.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All 4 Core Categories</option>
            <option value="turnkey_fitout">1. Turnkey Interior Fit-Out</option>
            <option value="commercial_interior">2. Commercial & Retail Works</option>
            <option value="office_renovation">3. Corporate Office Renovations</option>
            <option value="signage_branding">4. Signage & Branding</option>
          </select>

          <button
            onClick={() => {
              setEditingLead(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/30 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="overflow-x-auto pb-6">
        <div className="flex space-x-4 min-w-[1400px]">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.status === stage.id);
            const totalStageValue = stageLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

            return (
              <div
                key={stage.id}
                className="w-80 shrink-0 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col max-h-[calc(100vh-16rem)]"
              >
                {/* Column Header */}
                <div className={`p-4 border-b border-slate-800 rounded-t-2xl ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider">{stage.label}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-300 mt-1">
                    Value: {formatCurrency(totalStageValue)}
                  </p>
                </div>

                {/* Column Cards Container */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {stageLeads.length === 0 ? (
                    <p className="text-[11px] text-slate-600 text-center py-8 italic">No deals in this stage</p>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setEditingLead(lead);
                          setIsModalOpen(true);
                        }}
                        className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                            {lead.company}
                          </h4>
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 shrink-0">
                            {formatCurrency(lead.estimatedValue)}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300">
                          <p className="font-semibold text-slate-200">👤 {lead.name} {lead.title ? `(${lead.title})` : ''}</p>
                          <p className="text-slate-400 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{lead.city || 'India'}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[10px]">
                          <span className="text-blue-400 font-semibold bg-blue-950/60 px-2 py-0.5 rounded">
                            {getCategoryTag(lead.category)}
                          </span>

                          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="p-1 text-emerald-400 hover:bg-emerald-950 rounded"
                                title={`Call ${lead.phone}`}
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}`}
                                className="p-1 text-blue-400 hover:bg-blue-950 rounded"
                                title={`Email ${lead.email}`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Fast Move Dropdown */}
                        <div
                          className="pt-2 border-t border-slate-700/40 flex justify-between items-center text-[10px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-slate-500">Move to:</span>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 text-[10px]"
                          >
                            {STAGES.map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={editingLead}
        onSaved={fetchLeads}
      />
    </div>
  );
}
