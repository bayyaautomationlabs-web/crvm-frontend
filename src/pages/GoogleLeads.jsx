import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Phone,
  Globe,
  Plus,
  CheckCircle2,
  Filter,
  Sparkles,
  Download,
  Flame,
  Star
} from 'lucide-react';
import api from '../services/api';

const INDIAN_CITIES = [
  'Bangalore',
  'Hyderabad',
  'Mumbai',
  'Delhi-NCR',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad'
];

const SEARCH_CATEGORIES = [
  { id: 'turnkey_fitout', label: '1. Turnkey Interior Fit-Out (Corporate Tech Parks, BFSI)', query: 'Corporate Tech Park Office' },
  { id: 'commercial_interior', label: '2. Commercial & Retail Interiors (Showrooms, Stores)', query: 'Retail Showroom Commercial Store' },
  { id: 'office_renovation', label: '3. Corporate Office Renovations (Modernization)', query: 'Corporate Office Headquarters' },
  { id: 'signage_branding', label: '4. Signage & Branding Solutions (Hospitals, Chains)', query: 'Multi Speciality Clinic Hospital Diagnostic' },
];

export default function GoogleLeads() {
  const [city, setCity] = useState('Bangalore');
  const [category, setCategory] = useState('turnkey_fitout');
  const [customQuery, setCustomQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState(null);
  const [importedSet, setImportedSet] = useState(new Set());
  const [bulkImporting, setBulkImporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setSuccessMsg('');
      const defaultCatObj = SEARCH_CATEGORIES.find(c => c.id === category);
      const queryToUse = customQuery || defaultCatObj?.query || 'Corporate Office';

      const res = await api.post('/google/search', {
        query: queryToUse,
        city,
        category
      });

      setLeads(res.data.leads || []);
    } catch (err) {
      console.error('Google search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const importSingleLead = async (lead, index) => {
    try {
      setImportingId(index);
      await api.post('/leads', lead);
      setImportedSet(prev => new Set(prev).add(index));
      setSuccessMsg(`"${lead.company}" added to CRM Pipeline!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to import lead:', err);
    } finally {
      setImportingId(null);
    }
  };

  const importAllLeads = async () => {
    try {
      setBulkImporting(true);
      const unimported = leads.filter((_, idx) => !importedSet.has(idx));
      if (unimported.length === 0) return;

      await api.post('/leads/bulk-import', { leads: unimported });

      const allIdx = new Set(leads.map((_, i) => i));
      setImportedSet(allIdx);
      setSuccessMsg(`Successfully imported ${unimported.length} leads into MYN Pipeline!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Failed to bulk import:', err);
    } finally {
      setBulkImporting(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '₹25 L';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-1">
            <Search className="w-4 h-4 text-blue-400" />
            <span>Google Commercial Leads Finder</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Discover Corporate Offices, Retail Hubs & Fit-Out Opportunities
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Query commercial business parks, corporate headquarters, and retail expansions across Indian metros.
          </p>
        </div>

        {leads.length > 0 && (
          <button
            onClick={importAllLeads}
            disabled={bulkImporting}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{bulkImporting ? 'Importing...' : `Import All (${leads.length}) to CRM`}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Filters Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* City Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Metro City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">MYN Core Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-blue-500"
              >
                {SEARCH_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Custom Search Term */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Custom Keyword / Sector (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Fintech Campus, Luxury Retail, Hospital Chain"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Discovering Commercial Leads...' : 'Search Google Leads'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Discovered Commercial Leads</h3>
            <p className="text-xs text-slate-400">
              {leads.length > 0 ? `Found ${leads.length} high-intent commercial prospects in ${city}` : 'Click Search above to populate actionable leads.'}
            </p>
          </div>
        </div>

        {leads.length === 0 && !loading && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Ready to search Google Leads</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Select an Indian metro city like Bangalore or Hyderabad, pick a service category, and hit search.
            </p>
          </div>
        )}

        {leads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map((lead, idx) => {
              const isImported = importedSet.has(idx);
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isImported
                      ? 'bg-emerald-950/20 border-emerald-800/60'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">{lead.company}</h4>
                      <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-1.5">
                        <span className="font-semibold text-blue-400">👤 {lead.name}</span>
                        <span>•</span>
                        <span className="text-slate-400">{lead.title}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-800/60">
                        {formatCurrency(lead.estimatedValue)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <p className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{lead.address}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-300 font-mono">{lead.phone}</span>
                    </p>
                    {lead.website && (
                      <p className="flex items-center space-x-2">
                        <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                          {lead.website}
                        </a>
                      </p>
                    )}
                    <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800 mt-2">
                      💡 {lead.notes}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{lead.rating || '4.8'}</span>
                      <span className="text-slate-500 font-normal">Google Rating</span>
                    </div>

                    <button
                      onClick={() => importSingleLead(lead, idx)}
                      disabled={isImported || importingId === idx}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                        isImported
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/60 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                      }`}
                    >
                      {isImported ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Imported to CRM</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{importingId === idx ? 'Adding...' : 'Push to CRM'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
