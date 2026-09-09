import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './sales-workspace.css';
export default function SourceSync() {
  const [status,setStatus] = useState(null), [error,setError] = useState(''), [busy,setBusy] = useState(false), [result,setResult] = useState(null);
  const load = () => api.get('/sales/automation').then(r => setStatus(r.data));
  useEffect(() => { load().catch(() => setError('Connection status unavailable. Please refresh.')); }, []);
  async function sync() {
    setBusy(true); setError(''); setResult(null);
    try { const {data} = await api.post('/integrations/make/sync', {limit:50}); setResult(data.counts); await load(); }
    catch(e) { setError(e.response?.data?.error || 'Sync failed. No success has been confirmed.'); }
    finally { setBusy(false); }
  }
  return <div className="sw-root"><header className="sw-heading"><div><span className="sw-kicker">SOURCE CONNECTION & RUN HISTORY</span><h1>Synchronize records</h1><p>See what is connected and what each run actually saved.</p></div><Link to="/leads">View prospects →</Link></header>{error && <p className="sw-alert" role="alert">{error}</p>}<section className="sw-panel"><span className="sw-pill">{status ? status.configured ? 'Export configured' : 'Setup required' : 'Checking connection…'}</span><h2>Make acquisition connection</h2><p>{status?.message}</p><div className="sw-target"><strong>Current target</strong><span>Hyderabad business prospects only</span><small>Google Maps listings → Make → CRVM. Vendor records and other cities are rejected by this intake.</small></div><p className="sw-muted">The existing connection imports saved records. Fresh discovery still needs a verified Make + source run; no success is claimed until records appear with a source run and Hyderabad location.</p><button className="sw-primary" disabled={!status?.configured || busy} onClick={sync}>{busy ? 'Importing saved records…' : 'Import saved records from Make'}</button><p><a href="https://eu1.make.com/1963743/scenarios/7214839" target="_blank" rel="noreferrer">Open existing Make scenario ↗</a></p></section>{result && <section className="sw-panel" role="status"><h2>Import result</h2><p>Received: {result.received} · New: {result.created} · Duplicates skipped: {result.duplicates} · Rejected: {result.rejected}</p><p>New records are prospects until their requirements have been confirmed.</p></section>}<section className="sw-panel sw-table-wrap"><h2>Recent runs</h2><table><thead><tr><th>Started (UTC)</th><th>Status</th><th>Received</th><th>New</th><th>Duplicates</th><th>Rejected</th></tr></thead><tbody>{status?.runs.map(run => <tr key={run.id}><td>{run.startedAt}</td><td>{run.status}</td><td>{run.received}</td><td>{run.created}</td><td>{run.duplicates}</td><td>{run.rejected}</td></tr>)}</tbody></table>{status && !status.runs.length && <p>No runs recorded by the updated integration.</p>}</section></div>;
}
