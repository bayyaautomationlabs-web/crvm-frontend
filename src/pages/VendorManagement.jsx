import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Building2,
  CheckCircle2,
  ChevronRight,
  Edit3,
  FileUp,
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

const IMPORT_FIELDS = {
  company: ['company', 'vendor', 'vendor name', 'vendor_name', 'company name', 'company_name', 'business name', 'business_name'],
  name: ['name', 'contact', 'contact name', 'contact_name', 'person', 'decision maker', 'decision_maker'],
  email: ['email', 'email address', 'email_address'],
  phone: ['phone', 'phone number', 'phone_number', 'mobile', 'whatsapp'],
  website: ['website', 'web site', 'url'],
  city: ['city', 'location', 'town'],
  state: ['state', 'region'],
  address: ['address', 'full address', 'full_address'],
  category: ['category', 'service', 'service category', 'service_category'],
  notes: ['notes', 'note', 'details', 'description']
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted;
    } else if (character === ',' && !quoted) { row.push(value.trim()); value = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(value.trim());
      if (row.some(cell => cell)) rows.push(row);
      row = []; value = '';
    } else value += character;
  }
  row.push(value.trim());
  if (row.some(cell => cell)) rows.push(row);
  return rows;
}

function normaliseCsvLeads(text) {
  const [headerRow, ...dataRows] = parseCsv(text);
  if (!headerRow?.length) return [];
  const headers = headerRow.map(header => header.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
  const readField = (row, aliases) => {
    const column = headers.findIndex(header => aliases.includes(header));
    return column >= 0 ? String(row[column] || '').trim() : '';
  };
  return dataRows.map(row => ({
    company: readField(row, IMPORT_FIELDS.company),
    name: readField(row, IMPORT_FIELDS.name),
    email: readField(row, IMPORT_FIELDS.email),
    phone: readField(row, IMPORT_FIELDS.phone),
    website: readField(row, IMPORT_FIELDS.website),
    city: readField(row, IMPORT_FIELDS.city),
    state: readField(row, IMPORT_FIELDS.state),
    address: readField(row, IMPORT_FIELDS.address),
    category: readField(row, IMPORT_FIELDS.category) || 'turnkey_fitout',
    notes: readField(row, IMPORT_FIELDS.notes)
  })).filter(item => item.company);
}

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
        <p className="vm-modal-note">Manual records are kept separate from CSV imports and can be refreshed later.</p>
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

function VendorImport({ onClose, onSaved }) {
  const [fileName, setFileName] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState(null);

  const chooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(''); setSummary(null); setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = normaliseCsvLeads(String(reader.result || ''));
      if (!parsed.length) setError('No usable vendor rows found. The CSV needs a Company or Vendor column.');
      setRecords(parsed);
    };
    reader.onerror = () => setError('The file could not be read. Please choose a CSV file and try again.');
    reader.readAsText(file);
  };

  const submit = async () => {
    if (!records.length) return setError('Choose a CSV file with at least one vendor/company row.');
    try {
      setImporting(true); setError('');
      const response = await api.post('/leads/bulk-import', { leads: records.map(record => ({ ...record, recordType: 'vendor', source: 'csv_import', status: 'new' })) });
      setSummary(response.data);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'The vendor import could not be completed.');
    } finally { setImporting(false); }
  };

  return <div className="vm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Import vendor CSV">
    <div className="vm-modal">
      <div className="vm-modal-head"><div><span className="vm-eyebrow">Free vendor import</span><h3>Import vendor CSV</h3></div><button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      <p className="vm-modal-note">No Google Maps API, billing or Apify account is used. Include a <strong>Company</strong> or <strong>Vendor</strong> column; contact, email, phone, city and service are optional.</p>
      <label className="vm-file-picker"><FileUp size={22} /><span><strong>{fileName || 'Choose a CSV file'}</strong><small>{records.length ? `${records.length} valid vendor record${records.length === 1 ? '' : 's'} ready` : 'CSV only — your data stays in CRVM'}</small></span><input type="file" accept=".csv,text/csv" onChange={chooseFile} /></label>
      {error && <div className="vm-error">{error}</div>}
      {summary && <div className="vm-import-summary"><CheckCircle2 size={18} /><div><strong>{summary.created ?? summary.count ?? 0} new vendor record(s) added</strong><p>{summary.duplicates ?? 0} duplicate(s) skipped · {summary.rejected ?? 0} row(s) rejected.</p></div></div>}
      <div className="vm-modal-actions"><button type="button" className="vm-btn vm-btn-muted" onClick={onClose}>{summary ? 'Done' : 'Cancel'}</button><button type="button" className="vm-btn vm-btn-primary" disabled={!records.length || importing || Boolean(summary)} onClick={submit}><FileUp size={16} />{importing ? 'Importing…' : `Import ${records.length || ''} vendor${records.length === 1 ? '' : 's'}`}</button></div>
    </div>
  </div>;
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
  const [showImport, setShowImport] = useState(false);
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
  const importedCount = vendors.filter(v => ['csv_import', 'google', 'google_maps'].includes(String(v.source || ''))).length;
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
        <div><span className="vm-eyebrow"><ShieldCheck size={14} /> CRVM Vendor Operations</span><h1>Vendor management suite</h1><p>One clear register for CSV imports, verified partners, materials and admin controls.</p></div>
        <div className="vm-hero-actions"><button className="vm-btn vm-btn-outline" onClick={() => fetchVendors(true)} disabled={refreshing}><RefreshCw size={15} className={refreshing ? 'vm-spin' : ''} />{refreshing ? 'Refreshing' : 'Refresh records'}</button><button className="vm-btn vm-btn-outline" onClick={() => setShowImport(true)}><FileUp size={16} />Import CSV</button><button className="vm-btn vm-btn-primary" onClick={() => setShowForm(true)}><Plus size={16} />Add vendor</button></div>
      </header>

      <section className="vm-metrics"><Metric label="Total vendors" value={vendors.length} tone="cyan" detail="CRM vendor records" /><Metric label="Added today" value={freshToday} tone="green" detail="Date-wise intake" /><Metric label="Imported records" value={importedCount} tone="blue" detail="CSV and verified sources" /><Metric label="Material options" value={activeMaterials} tone="amber" detail="Ready for estimates" /></section>

      <nav className="vm-tabs" aria-label="Vendor management sections">
        <button className={activeTab === 'vendors' ? 'active' : ''} onClick={() => setActiveTab('vendors')}><Building2 size={16} />Vendors <b>{vendors.length}</b></button>
        <button className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}><Package size={16} />Materials <b>{activeMaterials}</b></button>
        <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}><Layers3 size={16} />Admin controls</button>
      </nav>

      {activeTab === 'vendors' && <>
        <section className="vm-panel vm-filter-panel"><div className="vm-panel-title"><div><span className="vm-eyebrow"><Filter size={13} /> Vendor register</span><h2>Search and manage vendors</h2></div><span className="vm-source-status"><span /> CSV import ready</span></div><div className="vm-filters"><label className="vm-search"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company, contact, city, phone…" /></label><select value={city} onChange={e => setCity(e.target.value)}><option value="">All cities</option>{cities.map(item => <option key={item}>{item}</option>)}</select><select value={category} onChange={e => setCategory(e.target.value)}><option value="">All service categories</option>{VENDOR_CATEGORIES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select><select value={source} onChange={e => setSource(e.target.value)}><option value="">All sources</option><option value="csv_import">CSV import</option><option value="manual">Manual</option></select></div></section>
        <section className="vm-panel"><div className="vm-list-head"><div><h2>Vendor records</h2><p>{filtered.length} shown · duplicates are checked by email, phone, source ID and company/city before saving.</p></div><span className="vm-count-pill">{filtered.length} records</span></div>{loading ? <div className="vm-empty"><RefreshCw className="vm-spin" /><p>Loading vendor records…</p></div> : filtered.length === 0 ? <div className="vm-empty"><Building2 size={32} /><h3>No vendor records found</h3><p>Import a verified vendor CSV, or add a vendor manually.</p><button className="vm-btn vm-btn-primary" onClick={() => setShowImport(true)}><FileUp size={15} />Import vendor CSV</button></div> : <div className="vm-table-wrap"><table className="vm-table"><thead><tr><th>Vendor</th><th>Location</th><th>Service</th><th>Source</th><th>Last updated</th><th aria-label="Actions" /></tr></thead><tbody>{filtered.map(v => <tr key={v.id}><td><div className="vm-vendor-cell"><span className="vm-vendor-mark">{(v.company || 'V').slice(0, 1).toUpperCase()}</span><div><strong>{v.company}</strong><small>{v.name || 'Contact not supplied'}{v.title ? ` · ${v.title}` : ''}</small><div className="vm-contact-row">{v.phone && <a href={`tel:${v.phone}`}><Phone size={12} />{v.phone}</a>}{v.email && <a href={`mailto:${v.email}`}><Mail size={12} />{v.email}</a>}</div></div></div></td><td><span className="vm-location"><MapPin size={13} />{v.city || 'Not supplied'}</span><small>{v.address || 'Address not supplied'}</small></td><td><span className="vm-tag">{VENDOR_CATEGORIES.find(item => item.id === v.category)?.label || v.category || 'General vendor'}</span></td><td><span className={`vm-source vm-source-${String(v.source || 'manual').replace(/[^a-z_]/g, '')}`}><Globe2 size={12} />{v.source || 'manual'}</span></td><td><span className="vm-freshness"><CheckCircle2 size={13} />{v.updatedAt ? new Date(v.updatedAt).toLocaleDateString('en-IN') : '—'}</span></td><td><button className="vm-icon-btn" title="Open vendor details"><ChevronRight size={17} /></button></td></tr>)}</tbody></table></div>}</section>
      </>}

      {activeTab === 'materials' && <section className="vm-material-layout"><div className="vm-panel vm-material-nav"><div className="vm-panel-title"><div><span className="vm-eyebrow"><Package size={13} /> Catalog controls</span><h2>Materials & options</h2></div></div><p className="vm-muted">Keep the choices used in BOQs, vendor briefs and fit-out estimates clear and consistent.</p><div className="vm-group-list">{MATERIAL_GROUPS.map(group => <button key={group.id} className={materialGroup === group.id ? 'active' : ''} onClick={() => setMaterialGroup(group.id)}><span><strong>{group.label}</strong><small>{group.hint}</small></span><b>{materials.filter(item => item.group === group.id && item.active).length}</b></button>)}</div></div><div className="vm-panel vm-material-list"><div className="vm-list-head"><div><span className="vm-eyebrow">Selected group</span><h2>{MATERIAL_GROUPS.find(item => item.id === materialGroup)?.label}</h2><p>Options are editable catalog entries; vendor records remain live from CRM.</p></div></div><form className="vm-add-material" onSubmit={addMaterial}><input value={newMaterial} onChange={e => setNewMaterial(e.target.value)} placeholder="Add a material option…" /><button className="vm-btn vm-btn-primary"><Plus size={15} />Add option</button></form><div className="vm-material-rows">{materials.filter(item => item.group === materialGroup && item.active).map(item => <div className="vm-material-row" key={item.id}><span className="vm-material-icon"><Package size={16} /></span><div><strong>{item.name}</strong><small>Unit: {item.unit} · {item.supplier || 'Supplier can be assigned in vendor records'}</small></div><button type="button" className="vm-icon-btn" onClick={() => removeMaterial(item.id)} title="Archive material"><Archive size={15} /></button></div>)}</div></div></section>}

      {activeTab === 'admin' && <section className="vm-admin-grid"><div className="vm-panel"><span className="vm-eyebrow"><ShieldCheck size={13} /> Data rules</span><h2>Vendor data safeguards</h2><div className="vm-rule"><CheckCircle2 size={16} /><div><strong>Free CSV vendor import</strong><p>No Google Maps API, Apify or LinkedIn account is used for this route.</p></div></div><div className="vm-rule"><CheckCircle2 size={16} /><div><strong>Duplicate protection</strong><p>Matching source ID, email, phone or company + city skips the existing record.</p></div></div><div className="vm-rule"><CheckCircle2 size={16} /><div><strong>Source labeling</strong><p>Every record shows where it came from and when it was last updated.</p></div></div></div><div className="vm-panel"><span className="vm-eyebrow"><Sparkles size={13} /> Daily operations</span><h2>What to do next</h2><ol className="vm-next-steps"><li><b>1</b><span>Export your verified vendor list as a CSV.</span></li><li><b>2</b><span>Choose <strong>Import CSV</strong> in the vendor register.</span></li><li><b>3</b><span>Review by city or service before assigning a vendor to a BOQ.</span></li></ol><div className="vm-notice"><Edit3 size={15} /><span>Materials can be maintained here without changing vendor records.</span></div></div></section>}

      {showForm && <VendorForm onClose={() => setShowForm(false)} onSaved={saveVendor} />}
      {showImport && <VendorImport onClose={() => setShowImport(false)} onSaved={() => fetchVendors(true)} />}
    </div>
  );
}
