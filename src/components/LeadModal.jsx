import React, { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, Globe, MapPin, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  { id: 'turnkey_fitout', label: '1. Turnkey Interior Fit-Out Projects' },
  { id: 'commercial_interior', label: '2. Office, Retail & Commercial Interior Works' },
  { id: 'office_renovation', label: '3. Corporate Office Renovations' },
  { id: 'signage_branding', label: '4. Signage & Branding Solutions' },
  { id: 'facility_amc', label: 'Facility Management & AMC Services' },
];

const STATUSES = [
  { id: 'new', label: 'New Lead' },
  { id: 'contacted', label: 'Contacted / Outreach' },
  { id: 'discussion', label: 'Requirement Discussion' },
  { id: 'site_visit_scheduled', label: 'Site Visit Scheduled' },
  { id: 'boq_sent', label: 'BOQ / Estimate Sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won / Project Awarded' },
  { id: 'lost', label: 'Lost' },
];

export default function LeadModal({ isOpen, onClose, lead, onSaved }) {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    title: '',
    phone: '',
    email: '',
    website: '',
    city: 'Bangalore',
    state: 'Karnataka',
    address: '',
    category: 'turnkey_fitout',
    status: 'new',
    source: 'manual',
    estimatedValue: 2500000,
    notes: '',
    assignedTo: 'Sales Team'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({
        company: lead.company || '',
        name: lead.name || '',
        title: lead.title || '',
        phone: lead.phone || '',
        email: lead.email || '',
        website: lead.website || '',
        city: lead.city || 'Bangalore',
        state: lead.state || 'Karnataka',
        address: lead.address || '',
        category: lead.category || 'turnkey_fitout',
        status: lead.status || 'new',
        source: lead.source || 'manual',
        estimatedValue: lead.estimatedValue || 2500000,
        notes: lead.notes || '',
        assignedTo: lead.assignedTo || 'Sales Team'
      });
    } else {
      setFormData({
        company: '',
        name: '',
        title: '',
        phone: '',
        email: '',
        website: '',
        city: 'Bangalore',
        state: 'Karnataka',
        address: '',
        category: 'turnkey_fitout',
        status: 'new',
        source: 'manual',
        estimatedValue: 2500000,
        notes: '',
        assignedTo: 'Sales Team'
      });
    }
    setError('');
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim()) {
      setError('Company name is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (lead && lead.id) {
        await api.put(`/leads/${lead.id}`, formData);
      } else {
        await api.post('/leads', formData);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {lead ? 'Edit Commercial Lead' : 'Add New Commercial Lead'}
            </h2>
            <p className="text-xs text-slate-400">Meet Your Needs (MYN) CRM Record</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Project Name *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Park, Retail Outlet"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Title</label>
              <input
                type="text"
                placeholder="e.g. Facility Manager, Head of Admin"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="+91-9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City / Region</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Bangalore, Hyderabad..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Service Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pipeline Stage</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Value (₹ INR)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  placeholder="2500000"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="google">Google Finder / Places</option>
                <option value="google_maps">Google Maps via Make</option>
                <option value="linkedin">LinkedIn Outreach</option>
                <option value="apify">Apify</option>
                <option value="apify_linkedin">LinkedIn via Apify</option>
                <option value="apify_google_maps">Google Maps via Apify</option>
                <option value="website">Website Inquiry</option>
                <option value="manual">Manual Direct Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes & Fit-Out Requirements</label>
            <textarea
              rows={3}
              placeholder="e.g. 20,000 sq.ft turnkey office setup, 150 workstations, false ceiling, lighting & glass partition works."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
