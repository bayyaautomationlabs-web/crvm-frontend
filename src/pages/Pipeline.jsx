import React, { useEffect, useState } from 'react';
import { KanbanSquare, Mail, MapPin, Phone, Plus } from 'lucide-react';
import api from '../services/api';
import LeadModal from '../components/LeadModal';

const STAGES = [
  { id: 'new', label: 'New leads' },
  { id: 'contacted', label: 'In outreach' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'site_visit_scheduled', label: 'Site visit' },
  { id: 'boq_sent', label: 'Quote sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Awarded' },
];

const categoryLabel = (category) => ({
  turnkey_fitout: 'Turnkey fit-out',
  commercial_interior: 'Commercial interiors',
  office_renovation: 'Office renovations',
  signage_branding: 'Signage & branding',
}[category] || 'CRM lead');

export default function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [category, setCategory] = useState('');
  const [editingLead, setEditingLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    try {
      const response = await api.get('/leads?limit=200');
      setLeads(response.data.leads || []);
    } catch (error) { console.error('Failed to load pipeline:', error); }
  };

  useEffect(() => { load(); }, []);
  const filtered = category ? leads.filter((lead) => lead.category === category) : leads;
  const money = (amount) => Number(amount || 0) ? `₹${Number(amount).toLocaleString('en-IN')}` : '₹0';
  const updateStage = async (id, status) => {
    try { await api.put(`/leads/${id}`, { status }); await load(); } catch (error) { console.error('Failed to update stage:', error); }
  };

  return (
    <div className="pipeline-reference">
      <header className="pipeline-reference-head">
        <div><p><KanbanSquare size={14} /> CRVM DEAL PIPELINE</p><h2>Deal tracking</h2><span>Keep every customer opportunity visible from first contact to awarded project.</span></div>
        <div className="pipeline-actions"><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All core categories</option><option value="turnkey_fitout">Turnkey interior fit-out</option><option value="commercial_interior">Commercial interiors</option><option value="office_renovation">Office renovations</option><option value="signage_branding">Signage & branding</option></select><button type="button" onClick={() => { setEditingLead(null); setIsModalOpen(true); }}><Plus size={15} /> New lead</button></div>
      </header>

      <section className="pipeline-summary"><div><b>{filtered.length}</b><span>Open CRM leads</span></div><div><b>{filtered.filter((lead) => lead.status === 'discussion').length}</b><span>In discussion</span></div><div><b>{filtered.filter((lead) => lead.status === 'site_visit_scheduled').length}</b><span>Site visits</span></div><div><b>{filtered.filter((lead) => lead.status === 'won').length}</b><span>Awarded</span></div></section>

      <section className="pipeline-board">
        {STAGES.slice(0, 4).map((stage, index) => {
          const items = filtered.filter((lead) => lead.status === stage.id);
          return <article key={stage.id} className={`pipeline-stage pipeline-stage-${index + 1}`}><header><div><span>{stage.label}</span><small>{items.length} {items.length === 1 ? 'lead' : 'leads'}</small></div><b>{items.length}</b></header><div className="pipeline-stage-body">{items.length === 0 ? <p className="pipeline-empty">No leads in this stage</p> : items.map((lead) => <article key={lead.id} className="pipeline-lead" onClick={() => { setEditingLead(lead); setIsModalOpen(true); }}><div><h3>{lead.company}</h3><strong>{money(lead.estimatedValue)}</strong></div><p>👤 {lead.name || 'Contact pending'}</p><p><MapPin size={12} /> {lead.city || 'India'}</p><footer><span>{categoryLabel(lead.category)}</span>{lead.phone && <a href={`tel:${lead.phone}`} onClick={(event) => event.stopPropagation()}><Phone size={13} /></a>}{lead.email && <a href={`mailto:${lead.email}`} onClick={(event) => event.stopPropagation()}><Mail size={13} /></a>}</footer><select value={lead.status} onClick={(event) => event.stopPropagation()} onChange={(event) => updateStage(lead.id, event.target.value)}>{STAGES.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}<option value="lost">Lost</option></select></article>)}</div></article>;
        })}
      </section>

      <section className="pipeline-next-stages">{STAGES.slice(4).map((stage) => <div key={stage.id}><span>{stage.label}</span><b>{filtered.filter((lead) => lead.status === stage.id).length}</b></div>)}</section>
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lead={editingLead} onSaved={load} />
    </div>
  );
}
