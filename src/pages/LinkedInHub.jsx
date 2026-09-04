import React, { useState, useEffect } from 'react';
import {
  Linkedin,
  ShieldCheck,
  Send,
  MessageSquare,
  UserPlus,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  RefreshCw,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import api from '../services/api';

export default function LinkedInHub() {
  const [prospects, setProspects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [actionType, setActionType] = useState(null); // 'connect' | 'message'
  const [customText, setCustomText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New Prospect Form State
  const [newProspect, setNewProspect] = useState({
    fullName: '',
    company: '',
    headline: 'Facility & Infrastructure Head',
    location: 'Bangalore, India',
    linkedinUrl: '',
    category: 'turnkey_fitout'
  });

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/linkedin/prospects');
      setProspects(res.data.prospects || []);
      setStats(res.data.stats || null);
    } catch (err) {
      console.error('Failed to fetch LinkedIn prospects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  const openActionModal = (prospect, type) => {
    setSelectedProspect(prospect);
    setActionType(type);

    const firstName = prospect.fullName.split(' ')[0];

    if (type === 'connect') {
      setCustomText(
        `Hi ${firstName}, noticed your infrastructure leadership at ${prospect.company}. We at Meet Your Needs (MYN) specialize in turnkey commercial interior fit-outs & corporate renovations across India for BFSI & IT hubs. Would love to connect & share our latest project portfolio!`
      );
    } else {
      setCustomText(
        `Hi ${firstName}, thanks for connecting!

Meet Your Needs (MYN) is a PAN-India turnkey interior fit-out and corporate renovation specialist. We deliver:
• Turnkey Interior Fit-Outs & Modern Workstations
• Corporate Office Renovations & Civil Alterations
• Retail & Commercial Interiors
• Signage & Branding Solutions

If you have any upcoming facility expansions or renovations, we would be glad to share our portfolio or provide a complimentary BOQ estimation.

📞 +91-72079 29888
✉️ sales@meetyourneeds.in
🌐 www.meetyourneeds.in`
      );
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedProspect) return;
    try {
      setActionLoading(true);
      if (actionType === 'connect') {
        const res = await api.post(`/linkedin/prospects/${selectedProspect.id}/connect`, {
          customNote: customText
        });
        setFeedback({ type: 'success', message: 'Connection request sent & logged in safety queue.' });
      } else {
        const res = await api.post(`/linkedin/prospects/${selectedProspect.id}/message`, {
          messageText: customText
        });
        setFeedback({ type: 'success', message: 'Message sent to 1st degree connection successfully.' });
      }

      setTimeout(() => setFeedback(null), 4000);
      setSelectedProspect(null);
      setActionType(null);
      fetchProspects();
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Action failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/linkedin/prospects/${id}/status`, { status: newStatus });
      fetchProspects();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddProspect = async (e) => {
    e.preventDefault();
    try {
      await api.post('/linkedin/prospects', newProspect);
      setIsAddModalOpen(false);
      setNewProspect({
        fullName: '',
        company: '',
        headline: 'Facility & Infrastructure Head',
        location: 'Bangalore, India',
        linkedinUrl: '',
        category: 'turnkey_fitout'
      });
      fetchProspects();
    } catch (err) {
      console.error('Failed to add prospect:', err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      not_contacted: { label: 'Not Contacted', color: 'bg-slate-800 text-slate-400 border-slate-700' },
      request_sent: { label: 'Request Sent', color: 'bg-amber-950/80 text-amber-300 border-amber-800' },
      connected: { label: '1st Degree Connected', color: 'bg-blue-950/80 text-blue-300 border-blue-800' },
      messaged: { label: 'Messaged', color: 'bg-purple-950/80 text-purple-300 border-purple-800' },
      replied: { label: 'Replied (Interested)', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
    };
    const item = map[status] || { label: status, color: 'bg-slate-800 text-slate-300' };
    return (
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.color}`}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-1">
            <Linkedin className="w-4 h-4 text-blue-400" />
            <span>LinkedIn Prospecting & 1st-Degree Outreach Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Target Facility Managers, Admin Heads & Project Directors
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Official Account: <span className="font-semibold text-blue-300 font-mono">contact.meetyourneeds@gmail.com</span> • PAN India Commercial Outreach
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Target Prospect</span>
          </button>
          <button
            onClick={fetchProspects}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-colors"
            title="Refresh Prospects"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety & Quota Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-900/40">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safe Daily Throttle</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-white">{stats?.sentToday || 0} / 25</h3>
            <span className="text-xs text-slate-400 font-semibold">Sent Today</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {stats?.remainingToday || 25} requests remaining for today. Restarts at 9:30 AM IST.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/30 border border-blue-900/40">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>1st Degree Network</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-white">
              {prospects.filter(p => p.connectionStatus === 'connected' || p.connectionStatus === 'messaged' || p.connectionStatus === 'replied').length}
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Active Connections</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Ready for automated portfolio & BOQ pitches.</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/30 border border-purple-900/40">
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase mb-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Inbound Replies & Inquiries</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-white">
              {prospects.filter(p => p.connectionStatus === 'replied').length}
            </h3>
            <span className="text-xs text-emerald-400 font-bold">Auto-Routed to CRM</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Alerts sent to sales@meetyourneeds.in</p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Prospects Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">LinkedIn Target Queue & Connections</h3>
            <p className="text-xs text-slate-400">Total Prospects in Queue: {prospects.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Prospect Name & Title</th>
                <th className="py-3 px-4">Company & Location</th>
                <th className="py-3 px-4">Connection Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Outreach Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {prospects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm flex items-center space-x-2">
                      <span>{p.fullName}</span>
                      <a
                        href={p.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                        title="Open LinkedIn Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-slate-400 text-xs">{p.headline}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-200">{p.company}</p>
                    <p className="text-slate-500 text-[11px]">{p.location || 'India'}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {getStatusBadge(p.connectionStatus)}
                      <div className="flex items-center space-x-1 mt-1">
                        <select
                          value={p.connectionStatus}
                          onChange={(e) => handleStatusChange(p.id, e.target.value)}
                          className="text-[10px] bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
                        >
                          <option value="not_contacted">Not Contacted</option>
                          <option value="request_sent">Request Sent</option>
                          <option value="connected">Connected</option>
                          <option value="messaged">Messaged</option>
                          <option value="replied">Replied (Interested)</option>
                        </select>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    <p className="text-[11px] italic line-clamp-1">{p.notes || 'Added to Outreach'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {p.connectionSentAt ? `Sent: ${new Date(p.connectionSentAt).toLocaleDateString()}` : 'Pending Action'}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {p.connectionStatus === 'not_contacted' && (
                        <button
                          onClick={() => openActionModal(p, 'connect')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Invite</span>
                        </button>
                      )}

                      {(p.connectionStatus === 'connected' || p.connectionStatus === 'messaged') && (
                        <button
                          onClick={() => openActionModal(p, 'message')}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-sm"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Send 1st Degree Message</span>
                        </button>
                      )}

                      {p.connectionStatus === 'request_sent' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'connected')}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
                        >
                          Mark Connected
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog (Send Connection Note or Message) */}
      {selectedProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Linkedin className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  {actionType === 'connect' ? 'Send Personalized Connection Invite' : 'Send 1st Degree Direct Message'}
                </h3>
              </div>
              <button onClick={() => setSelectedProspect(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
              <p className="font-bold text-white">{selectedProspect.fullName} ({selectedProspect.company})</p>
              <p className="text-slate-400">{selectedProspect.headline}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  {actionType === 'connect' ? 'Invite Note (Max 300 Characters)' : 'Commercial Fit-Out Pitch Message'}
                </label>
                {actionType === 'connect' && (
                  <span className={`text-[10px] font-mono ${customText.length > 300 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                    {customText.length}/300
                  </span>
                )}
              </div>
              <textarea
                rows={6}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProspect(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                disabled={actionLoading || (actionType === 'connect' && customText.length > 300)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{actionLoading ? 'Dispatching...' : 'Dispatch Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prospect Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Target Prospect to LinkedIn Queue</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddProspect} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newProspect.fullName}
                  onChange={(e) => setNewProspect({ ...newProspect, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Enterprise *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infosys, HDFC Bank, Titan Showrooms"
                  value={newProspect.company}
                  onChange={(e) => setNewProspect({ ...newProspect, company: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Head of Facilities & Real Estate"
                  value={newProspect.headline}
                  onChange={(e) => setNewProspect({ ...newProspect, headline: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  placeholder="https://www.linkedin.com/in/profilename"
                  value={newProspect.linkedinUrl}
                  onChange={(e) => setNewProspect({ ...newProspect, linkedinUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  Add Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
