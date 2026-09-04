import React, { useState } from 'react';
import {
  Zap,
  Download,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send,
  Mail,
  Layers,
  Database,
  Play,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

const SCENARIOS = [
  {
    id: 'scenario-1',
    title: 'Scenario 1: Multi-Channel Lead Ingestion & CRM Normalization',
    description: 'Captures inbound leads from Google Scraper, Web Forms, or Ads, validates phone/company data, categorizes under Turnkey/Renovation/Signage, and registers in the MYN CRM database.',
    trigger: 'Custom Webhook (POST /api/webhooks/inbound)',
    modules: ['Custom Webhook', 'Data Cleanser & Formatter', 'Router (Category Filter)', 'MYN CRM DB Module', 'Internal Alert'],
    blueprintFile: 'scenario-1-multichannel-ingestion.json'
  },
  {
    id: 'scenario-2',
    title: 'Scenario 2: Instant Sales Notification to sales@meetyourneeds.in',
    description: 'Triggers immediately when a new commercial lead or site visit request is registered. Compiles an executive HTML email card and delivers directly to sales@meetyourneeds.in and contact@meetyourneeds.in.',
    trigger: 'Webhook (Lead Created / High Priority)',
    modules: ['Custom Webhook', 'HTML Template Engine', 'Email / SMTP Dispatcher', 'WhatsApp Alert Gateway'],
    blueprintFile: 'scenario-2-lead-qualification.json'
  },
  {
    id: 'scenario-3',
    title: 'Scenario 3: LinkedIn Prospect Outreach & Safe Sync',
    description: 'Runs daily at 10:00 AM IST. Fetches pending LinkedIn prospects, applies the 25/day safety throttle, attaches personalized 300-char invite notes, and synchronizes status back to CRM.',
    trigger: 'Scheduled Timer (Weekdays 10:00 AM IST)',
    modules: ['HTTP Fetch Queue', 'Iterator (Daily 25 Batch)', 'Personalized Note Generator', 'LinkedIn Automation Worker', 'CRM Status Update'],
    blueprintFile: 'scenario-3-sales-notification-email.json'
  },
  {
    id: 'scenario-4',
    title: 'Scenario 4: LinkedIn Reply Detection & Stage Automation',
    description: 'Listens for replies from 1st-degree connections. Analyzes response intent, automatically moves the deal stage to "Requirement Discussion" or "Site Visit Scheduled", and alerts the sales team.',
    trigger: 'Webhook (Inbound LinkedIn Message)',
    modules: ['Custom Webhook', 'Intent Analyzer', 'Router', 'CRM Stage Updater', 'Urgent Sales Push Notification'],
    blueprintFile: 'scenario-4-linkedin-outreach-sync.json'
  },
  {
    id: 'scenario-5',
    title: 'Scenario 5: Weekly Executive Performance Digest',
    description: 'Runs every Monday at 9:00 AM IST. Computes metrics (New Leads, Connections Sent, BOQs Delivered, Estimated Pipeline Value) and emails a summary report to leadership.',
    trigger: 'Scheduled Timer (Mondays 9:00 AM IST)',
    modules: ['HTTP API Aggregator', 'Executive Summary Formatter', 'Email Dispatcher to Management'],
    blueprintFile: 'scenario-5-weekly-performance-digest.json'
  },
  {
    id: 'scenario-6',
    title: 'Scenario 6: Daily Google Vendor Sync',
    description: 'Runs daily, retrieves live Google Maps business records, normalizes vendor fields, and sends them to CRVM. Stable Google Place IDs, website, phone, and company/city matching prevent duplicate vendor records while existing vendors are refreshed.',
    trigger: 'Daily Schedule (Google Maps / Places)',
    modules: ['Google Maps / Places Search', 'Iterator (Each Business)', 'Data Normalizer', 'CRVM Vendor Upsert', 'Sync Metrics Logger'],
    blueprintFile: 'scenario-6-daily-google-vendor-sync.json'
  }
];

export default function MakeScenarios() {
  const [copiedScenario, setCopiedScenario] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncingMake, setSyncingMake] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleTestWebhook = async () => {
    try {
      setTestingWebhook(true);
      setTestResult(null);
      const res = await api.post('/webhooks/test', { eventType: 'lead_ingest' });
      setTestResult({ type: 'success', data: res.data });
    } catch (err) {
      setTestResult({ type: 'error', error: err.response?.data?.error || 'Test failed' });
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleSyncFromMake = async () => {
    try {
      setSyncingMake(true);
      setSyncResult(null);
      const res = await api.post('/integrations/make/sync', { limit: 500 });
      setSyncResult({ type: 'success', data: res.data });
    } catch (err) {
      setSyncResult({
        type: 'error',
        error: err.response?.data?.error || 'Make sync failed',
        detail: err.response?.data?.detail || ''
      });
    } finally {
      setSyncingMake(false);
    }
  };

  const copyBlueprintJson = (scenario) => {
    const blueprintData = {
      name: scenario.title,
      description: scenario.description,
      trigger: scenario.trigger,
      modules: scenario.modules,
      company: 'Meet Your Needs (MYN)',
      salesEmail: 'sales@meetyourneeds.in',
      phone: '+91-72079 29888',
      website: 'www.meetyourneeds.in',
      inboundEndpoint: `${window.location.origin}/api/webhooks/inbound`
    };

    navigator.clipboard.writeText(JSON.stringify(blueprintData, null, 2));
    setCopiedScenario(scenario.id);
    setTimeout(() => setCopiedScenario(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase mb-1">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Make.com (Integromat) Automation Blueprint Hub</span>
          </div>
              <h2 className="text-2xl font-black text-white">6 CRVM Workflow Scenarios</h2>
          <p className="text-xs text-slate-300 mt-1">
            Automate lead ingestion, LinkedIn outreach synchronization, and instant alerts to <span className="text-blue-300 font-mono">sales@meetyourneeds.in</span>.
          </p>
        </div>

        <a
          href="https://www.make.com"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-purple-600/30 shrink-0"
        >
          <span>Open Make.com</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Manual Make pull sync; deliberately never runs on a timer. */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-800/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pull Live Leads from Make
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Manually retrieves the Make Data Store export and saves only new LinkedIn, Google Maps, and Apify leads. Existing matches are skipped.
            </p>
          </div>
          <button
            onClick={handleSyncFromMake}
            disabled={syncingMake}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncingMake ? 'animate-spin' : ''}`} />
            <span>{syncingMake ? 'Syncing...' : 'Sync from Make'}</span>
          </button>
        </div>

        {syncResult && (
          <div className={`p-3 rounded-xl border text-xs ${
            syncResult.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
              : 'bg-red-950/40 border-red-800/50 text-red-300'
          }`}>
            {syncResult.type === 'success' ? (
              <span>
                Sync complete — received {syncResult.data.counts.received}, saved {syncResult.data.counts.created}, skipped {syncResult.data.counts.duplicates} duplicate(s), rejected {syncResult.data.counts.rejected}.
              </span>
            ) : (
              <span>{syncResult.error}{syncResult.detail ? ` ${syncResult.detail}` : ''}</span>
            )}
          </div>
        )}
      </div>

      {/* Webhook Endpoint & Live Tester */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Inbound Webhook URL (For Make.com HTTP / Webhook Modules)
            </h3>
            <p className="text-xs text-slate-400">Send JSON leads to this endpoint from any external source</p>
          </div>
          <button
            onClick={handleTestWebhook}
            disabled={testingWebhook}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all self-start sm:self-auto disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{testingWebhook ? 'Executing Test...' : 'Test Outbound Webhook'}</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 flex items-center justify-between">
          <span>{`${window.location.origin}/api/webhooks/inbound`}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/inbound`);
              alert('Webhook URL copied to clipboard!');
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
          >
            Copy URL
          </button>
        </div>

        {testResult && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
            ✅ Test result: {JSON.stringify(testResult, null, 2)}
          </div>
        )}
      </div>

      {/* 5 Scenarios List */}
      <div className="space-y-4">
        {SCENARIOS.map((s, idx) => {
          const isCopied = copiedScenario === s.id;
          return (
            <div
              key={s.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{s.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-3xl">{s.description}</p>
                </div>

                <button
                  onClick={() => copyBlueprintJson(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Blueprint Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Scenario Blueprint</span>
                    </>
                  )}
                </button>
              </div>

              {/* Module Flow Pills */}
              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400 mb-2">Module Pipeline Flow:</p>
                <div className="flex flex-wrap items-center gap-2">
                  {s.modules.map((m, mIdx) => (
                    <React.Fragment key={mIdx}>
                      <span className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium">
                        {m}
                      </span>
                      {mIdx < s.modules.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
