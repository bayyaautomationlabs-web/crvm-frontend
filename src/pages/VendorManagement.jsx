import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Building2,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Filter,
  Globe2,
  Layers3,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import api from '../services/api';

const VENDOR_CATEGORIES = [
  { id: 'turnkey_fitout', label: 'Turnkey Fit-Out' },
  { id: 'commercial_interior', label: 'Commercial & Retail' },
  { id: 'office_renovation', label: 'Office Renovation' },
  { id: 'signage_branding', label: 'Signage & Branding' },
  { id: 'facility_amc', label: 'Facility & AMC' }
];

const MATERIAL_GROUPS = [
  { id: 'flooring', label: 'Flooring', hint: 'Carpet tiles, vinyl, stone and raised floors' },
  { id: 'ceiling-lighting', label: 'Ceiling & Lighting', hint: 'Grid ceilings, linear lights and fixtures' },
  { id: 'partitions', label: 'Partitions & Glazing', hint: 'Glass, gypsum and demountable systems' },
  { id: 'hvac-electrical', label: 'HVAC & Electrical', hint: 'HVAC, power, data and controls' },
  { id: 'furniture-joinery', label: 'Furniture & Joinery', hint: 'Workstations, storage and custom joinery' },
  { id: 'signage', label: 'Signage & Branding', hint: 'Indoor, outdoor and wayfinding systems' }
];

const DEFAULT_MATERIALS = [
  { id: 'mat-1', group: 'flooring', name: 'Carpet Tiles', unit: 'sq.ft', supplier: '', active: true },
  { id: 'mat-2', group: 'flooring', name: 'Vinyl Flooring', unit: 'sq.ft', supplier: '', active: true },
  { id: 'mat-3', group: 'ceiling-lighting', name: 'Mineral Fibre Ceiling', unit: 'sq.ft', supplier: '', active: true },
  { id: 'mat-4', group: 'ceiling-lighting', name: 'Linear LED Light', unit: 'nos', supplier: '', active: true },
  { id: 'mat-5', group: 'partitions', name: 'Toughened Glass Partition', unit: 'sq.ft', supplier: '', active: true },
  { id: 'mat-6', group: 'partitions', name: 'Gypsum Partition', unit: 'sq.ft', supplier: '', active: true },
  { id: 'mat-7', group: 'hvac-electrical', name: 'VRF / HVAC Package', unit: 'project', supplier: '', active: true },
  { id: 'mat-8', group: 'furniture-joinery', name: 'Bench Workstation', unit: 'seat', supplier: '', active: true },
  { id: 'mat-9', group: 'signage', name: '3D Acrylic Signage', unit: 'sq.ft', supplier: '', active: true }
];

function Metric({ label, value, tone, detail }) {
  return (
    <div className={`vm-metric vm-metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function VendorForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', website: '', city: '', address: '', category: 'turnkey_fitout', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.company.trim()) return setError('Vendor/company name is required.');
    try {
      setSaving(true);
      setError('');
      await api.post('/leads', { ...form, recordType: 'vendor', source: 'manual', status: 'new', estimatedValue: 0 });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save vendor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Add vendor">
      <form className="vm-modal" onSubmit={submit}>
        <div className="vm-modal-head"><div><span className="vm-eyebrow">Vendor register</span><h3>Add vendor manually</h3></div><button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <p className="vm-modal-note">Manual records are kept separate from Google Maps imports and can be refreshed later.</p>
        {error && <div className="vm-error">{error}</div>}
        <div className="vm-form-grid">
          <label>Company / vendor name<input value={form.company} onChange={e => update('company', e.target.value)} placeholder="Acme Interiors" autoFocus /></label>
          <label>Contact person<input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Decision maker" /></label>
          <label>Phone / WhatsApp<input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 ..." /></label>
          <label>Email<input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="vendor@company.com" /></label>
          <label>Website<input value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://" /></label>
          <label>City / region<input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Bengaluru" /></label>
          <label>Service category<select value={form.category} onChange={e => update('category', e.target.value)}>{VENDOR_CATEGORIES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label className="vm-span-2">Address<input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Office / warehouse address" /></label>
          <label className="vm-span-2">Notes<textarea rows="3" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Capabilities, certifications, coverage and commercial notes" /></label>
        </div>
        <div className="vm-modal-actions"><button type="button" className="vm-btn vm-btn-muted" onClick={onClose}>Cancel</button><button className="vm-btn vm-btn-primary" disabled={saving}><Plus size={16} />{saving ? 'Saving…' : 'Save vendor'}</button></div>
      </form>
    </div>
  );
}

export default function VendorManagement() {
  const [activeTab, setActiveTab] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [materials, setMaterials] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crvm_material_catalog')) || DEFAULT_MATERIALS; } catch { return DEFAULT_MATERIALS; }
  });
  const [materialGroup, setMaterialGroup] = useState('flooring');
  const [newMaterial, setNewMaterial] = useState('');

  const fetchVendors = async (quiet = false) => {
    try {
      if (quiet) setRefreshing(true); else setLoading(true);
      const res = await api.get('/leads?recordType=vendor&limit=500');
      setVendors(res.data.leads || []);
    } catch (err) {
      console.error('Failed to load vendors:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);
  useEffect(() => { localStorage.setItem('crvm_material_catalog', JSON.stringify(materials)); }, [materials]);

  const cities = useMemo(() => [...new Set(vendors.map(v => v.city).filter(Boolean))].sort(), [vendors]);
  const filtered = useMemo(() => vendors.filter(v => {
    const haystack = `${v.company} ${v.name} ${v.email} ${v.phone} ${v.city} ${v.address}`.toLowerCase();
    return (!search || haystack.includes(search.toLowerCase())) && (!city || v.city === city) && (!category || v.category === category) && (!source || v.source === source);
  }), [vendors, search, city, category, source]);
  const today = new Date().toISOString().slice(0, 10);
  const freshToday = vendors.filter(v => String(v.createdAt || '').slice(0, 10) === today).length;
  const googleCount = vendors.filter(v => String(v.source || '').includes('google')).length;
  const activeMaterials = materials.filter(item => item.active).length;

  const addMaterial = (event) => {
    event.preventDefault();
    if (!newMaterial.trim()) return;
    setMaterials(prev => [...prev, { id: `mat-${Date.now()}`, group: materialGroup, name: newMaterial.trim(), unit: 'unit', supplier: '', active: true }]);
    setNewMaterial('');
  };
  const removeMaterial = (id) => setMaterials(prev => prev.map(item => item.id === id ? { ...item, active: false } : item));
  const saveVendor = () => { setShowForm(false); fetchVendors(true); };

  return (
    <div className="vm-page">
      <header className="vm-hero">
        <div><span className="vm-eyebrow"><ShieldCheck size={14} /> CRVM Vendor Operations</span><h1>Vendor management suite</h1><p>One clear register for live Google vendors, manual partners, materials and admin controls.</p></div>
        <div className="vm-hero-actions"><button className="vm-btn vm-btn-outline" onClick={() => fetchVendors(true)} disabled={refreshing}><RefreshCw size={15} className={refreshing ? 'vm-spin' : ''} />{refreshing ? 'Refreshing' : 'Refresh live data'}</button><button className="vm-btn vm-btn-primary" onClick={() => setShowForm(true)}><Plus size={16} />Add vendor</button></div>
      </header>

      <section className="vm-metrics"><Metric label="Total vendors" value={vendors.length} tone="cyan" detail="Live CRM records" /><Metric label="Added today" value={freshToday} tone="green" detail="Date-wise intake" /><Metric label="Google records" value={googleCount} tone="blue" detail="Maps / Places source" /><Metric label="Material options" value={activeMaterials} tone="amber" detail="Ready for estimates" /></section>

      <nav className="vm-tabs" aria-label="Vendor management sections">
        <button className={activeTab === 'vendors' ? 'active' : ''} onClick={() => setActiveTab('vendors')}><Building2 size={16} />Vendors <b>{vendors.length}</b></button>
        <button className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}><Package size={16} />Materials <b>{activeMaterials}</b></button>
        <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}><Layers3 size={16} />Admin controls</button>
      </nav>

      {activeTab === 'vendors' && <>
        <section className="vm-panel vm-filter-panel"><div className="vm-panel-title"><div><span className="vm-eyebrow"><Filter size={13} /> Live vendor register</span><h2>Search and manage vendors</h2></div><span className="vm-source-status"><span /> Google sync source</span></div><div className="vm-filters"><label className="vm-search"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company, contact, city, phone…" /></label><select value={city} onChange={e => setCity(e.target.value)}><option value="">All cities</option>{cities.map(item => <option key={item}>{item}</option>)}</select><select value={category} onChange={e => setCategory(e.target.value)}><option value="">All service categories</option>{VENDOR_CATEGORIES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select><select value={source} onChange={e => setSource(e.target.value)}><option value="">All sources</option><option value="google">Google</option><option value="google_maps">Google Maps</option><option value="manual">Manual</option></select></div></section>
        <section className="vm-panel"><div className="vm-list-head"><div><h2>Vendor records</h2><p>{filtered.length} shown · duplicates are prevented by source, email, phone and company/city matching.</p></div><span className="vm-count-pill">{filtered.length} records</span></div>{loading ? <div className="vm-empty"><RefreshCw className="vm-spin" /><p>Loading live vendor records…</p></div> : filtered.length === 0 ? <div className="vm-empty"><Building2 size={32} /><h3>No vendor records found</h3><p>Use Refresh live data after the Google Maps scenario runs, or add a verified vendor manually.</p><button className="vm-btn vm-btn-primary" onClick={() => setShowForm(true)}><Plus size={15} />Add first vendor</button></div> : <div className="vm-table-wrap"><table className="vm-table"><thead><tr><th>Vendor</th><th>Location</th><th>Service</th><th>Source</th><th>Last updated</th><th aria-label="Actions" /></tr></thead><tbody>{filtered.map(v => <tr key={v.id}><td><div className="vm-vendor-cell"><span className="vm-vendor-mark">{(v.company || 'V').slice(0, 1).toUpperCase()}</span><div><strong>{v.company}</strong><small>{v.name || 'Contact not supplied'}{v.title ? ` · ${v.title}` : ''}</small><div className="vm-contact-row">{v.phone && <a href={`tel:${v.phone}`}><Phone size={12} />{v.phone}</a>}{v.email && <a href={`mailto:${v.email}`}><Mail size={12} />{v.email}</a>}</div></div></div></td><td><span className="vm-location"><MapPin size={13} />{v.city || 'Not supplied'}</span><small>{v.address || 'Address not supplied'}</small></td><td><span className="vm-tag">{VENDOR_CATEGORIES.find(item => item.id === v.category)?.label || v.category || 'General vendor'}</span></td><td><span className={`vm-source vm-source-${String(v.source || 'manual').replace(/[^a-z_]/g, '')}`}><Globe2 size={12} />{v.source || 'manual'}</span></td><td><span className="vm-freshness"><CheckCircle2 size={13} />{v.updatedAt ? new Date(v.updatedAt).toLocaleDateString('en-IN') : '—'}</span></td><td><button className="vm-icon-btn" title="Open vendor details"><ChevronRight size={17} /></button></td></tr>)}</tbody></table></div>}</section>
      </>}

      {activeTab === 'materials' && <section className="vm-material-layout"><div className="vm-panel vm-material-nav"><div className="vm-panel-title"><div><span className="vm-eyebrow"><Package size={13} /> Catalog controls</span><h2>Materials & options</h2></div></div><p className="vm-muted">Keep the choices used in BOQs, vendor briefs and fit-out estimates clear and consistent.</p><div className="vm-group-list">{MATERIAL_GROUPS.map(group => <button key={group.id} className={materialGroup === group.id ? 'active' : ''} onClick={() => setMaterialGroup(group.id)}><span><strong>{group.label}</strong><small>{group.hint}</small></span><b>{materials.filter(item => item.group === group.id && item.active).length}</b></button>)}</div></div><div className="vm-panel vm-material-list"><div className="vm-list-head"><div><span className="vm-eyebrow">Selected group</span><h2>{MATERIAL_GROUPS.find(item => item.id === materialGroup)?.label}</h2><p>Options are editable catalog entries; vendor records remain live from CRM.</p></div></div><form className="vm-add-material" onSubmit={addMaterial}><input value={newMaterial} onChange={e => setNewMaterial(e.target.value)} placeholder="Add a material option…" /><button className="vm-btn vm-btn-primary"><Plus size={15} />Add option</button></form><div className="vm-material-rows">{materials.filter(item => item.group === materialGroup && item.active).map(item => <div className="vm-material-row" key={item.id}><span className="vm-material-icon"><Package size={16} /></span><div><strong>{item.name}</strong><small>Unit: {item.unit} · {item.supplier || 'Supplier can be assigned in vendor records'}</small></div><button type="button" className="vm-icon-btn" onClick={() => removeMaterial(item.id)} title="Archive material"><Archive size={15} /></button></div>)}</div></div></section>}

      {activeTab === 'admin' && <section className="vm-admin-grid"><div className="vm-panel"><span className="vm-eyebrow"><ShieldCheck size={13} /> Data rules</span><h2>Vendor data safeguards</h2><div className="vm-rule"><CheckCircle2 size={16} /><div><strong>Google-only vendor sync</strong><p>Apify and LinkedIn are not used for vendor records.</p></div></div><div className="vm-rule"><CheckCircle2 size={16} /><div><strong>Duplicate protection</strong><p>Matching source ID, email, phone or company + city updates the existing record.</p></div></div><div className="vm-rule"><CheckCircle2 size={16} /><div><strong>Live source labeling</strong><p>Every record shows where it came from and when it was last updated.</p></div></div></div><div className="vm-panel"><span className="vm-eyebrow"><Sparkles size={13} /> Daily operations</span><h2>What to do next</h2><ol className="vm-next-steps"><li><b>1</b><span>Run the daily Google Maps scenario.</span></li><li><b>2</b><span>Press <strong>Refresh live data</strong> here.</span></li><li><b>3</b><span>Filter by city or service before assigning a vendor to a BOQ.</span></li></ol><div className="vm-notice"><Edit3 size={15} /><span>Materials can be maintained here without changing live vendor data.</span></div></div></section>}

      {showForm && <VendorForm onClose={() => setShowForm(false)} onSaved={saveVendor} />}
    </div>
  );
}
