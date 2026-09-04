import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  Plus,
  Send,
  Linkedin,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import api from '../services/api';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [previewProspect, setPreviewProspect] = useState({
    firstName: 'Rajesh',
    company: 'Apex Cloud Technologies'
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/templates');
      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCopy = (text, id) => {
    const filled = text
      .replace(/{{FirstName}}/g, previewProspect.firstName)
      .replace(/{{Company}}/g, previewProspect.company);

    navigator.clipboard.writeText(filled);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getTypeBadge = (type) => {
    const map = {
      linkedin_invite: { label: 'LinkedIn Connection Note (300 char)', icon: Linkedin, color: 'text-blue-400 bg-blue-950/60 border-blue-800' },
      linkedin_followup: { label: '1st Degree Message Pitch', icon: Send, color: 'text-purple-400 bg-purple-950/60 border-purple-800' },
      email_pitch: { label: 'Commercial B2B Email Proposal', icon: Mail, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
      whatsapp_pitch: { label: 'WhatsApp Instant Pitch', icon: Phone, color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    };
    const item = map[type] || { label: type, icon: FileText, color: 'text-slate-300 bg-slate-800' };
    const Icon = item.icon;
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center space-x-1.5 ${item.color}`}>
        <Icon className="w-3 h-3" />
        <span>{item.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-1">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>High-Converting B2B Message & Pitch Templates</span>
          </div>
          <h2 className="text-2xl font-black text-white">Outreach & Commercial Pitch Library</h2>
          <p className="text-xs text-slate-300 mt-1">
            Pre-engineered templates for Turnkey Fit-Outs, Office Renovations, Commercial Interiors & Signage works.
          </p>
        </div>

        {/* Live Variable Replacer */}
        <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-center space-x-3 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0">Live Preview Vars:</span>
          <input
            type="text"
            placeholder="First Name"
            value={previewProspect.firstName}
            onChange={(e) => setPreviewProspect({ ...previewProspect, firstName: e.target.value })}
            className="w-24 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={previewProspect.company}
            onChange={(e) => setPreviewProspect({ ...previewProspect, company: e.target.value })}
            className="w-36 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((tmpl) => {
          const filledBody = tmpl.body
            .replace(/{{FirstName}}/g, previewProspect.firstName)
            .replace(/{{Company}}/g, previewProspect.company);

          const isCopied = copiedId === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{tmpl.title}</h3>
                    {tmpl.subject && (
                      <p className="text-xs text-blue-400 font-semibold mt-0.5">
                        Subject: {tmpl.subject}
                      </p>
                    )}
                  </div>
                  {getTypeBadge(tmpl.type)}
                </div>

                {/* Body Preview */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed mt-3">
                  {filledBody}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">
                  Variables: <code className="text-blue-300">{tmpl.variables}</code>
                </span>

                <button
                  onClick={() => handleCopy(tmpl.body, tmpl.id)}
                  className={`px-4 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all text-xs ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied with Variables!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Personalized Pitch</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
