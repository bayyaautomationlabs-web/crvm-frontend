import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Zap,
  Key,
  ShieldCheck,
  CheckCircle2,
  Save
} from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'Meet Your Needs (MYN)',
    companyPhone: '+91-72079 29888',
    salesEmail: 'sales@meetyourneeds.in',
    contactEmail: 'contact@meetyourneeds.in',
    website: 'https://www.meetyourneeds.in',
    linkedinEmail: 'contact.meetyourneeds@gmail.com',
    webhookLeadIngest: '',
    webhookSalesAlert: '',
    webhookOutreachSync: '',
    googleApiKey: '',
    dailyLinkedInLimit: 25
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data && res.data.settings) {
        setSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      await api.post('/settings', settings);
      setSuccessMsg('Settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-800/40 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-1">
            <SettingsIcon className="w-4 h-4 text-blue-400" />
            <span>System & Integration Configuration</span>
          </div>
          <h2 className="text-2xl font-black text-white">MYN Operational Settings</h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure contact info, Make.com webhook endpoints, and LinkedIn safety limits.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-white font-bold text-sm">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Meet Your Needs (MYN) Official Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Official Sales Phone</label>
              <input
                type="text"
                value={settings.companyPhone}
                onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sales Leads Email</label>
              <input
                type="email"
                value={settings.salesEmail}
                onChange={(e) => setSettings({ ...settings, salesEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">General Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Official Website</label>
              <input
                type="text"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn Account Email</label>
              <input
                type="text"
                value={settings.linkedinEmail}
                onChange={(e) => setSettings({ ...settings, linkedinEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Make.com Webhook URLs */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-white font-bold text-sm">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Make.com Webhook Endpoints</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Make.com Webhook URL (Lead Ingestion Flow)
              </label>
              <input
                type="text"
                placeholder="https://hook.eu1.make.com/xxxxxxxxxxxxxxxxxxxxxxxx"
                value={settings.webhookLeadIngest}
                onChange={(e) => setSettings({ ...settings, webhookLeadIngest: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Make.com Webhook URL (Instant Sales Alert Flow)
              </label>
              <input
                type="text"
                placeholder="https://hook.eu1.make.com/xxxxxxxxxxxxxxxxxxxxxxxx"
                value={settings.webhookSalesAlert}
                onChange={(e) => setSettings({ ...settings, webhookSalesAlert: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* LinkedIn Daily Cap */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safety & Rate Limits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Daily LinkedIn Connection Limit (Max 25 Recommended)
              </label>
              <input
                type="number"
                max={30}
                min={5}
                value={settings.dailyLinkedInLimit}
                onChange={(e) => setSettings({ ...settings, dailyLinkedInLimit: parseInt(e.target.value) || 25 })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Google Places API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={settings.googleApiKey}
                onChange={(e) => setSettings({ ...settings, googleApiKey: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
