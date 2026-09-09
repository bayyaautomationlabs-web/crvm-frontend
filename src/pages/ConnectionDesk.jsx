import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './sales-workspace.css';

const states = { sent: 'Message sent by me', replied: 'Reply received', not_relevant: 'Not relevant', do_not_contact: 'Do not contact' };

export default function ConnectionDesk() {
  const [data, setData] = useState(null), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [limit, setLimit] = useState(15), [busy, setBusy] = useState(false), [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(''), [outcome, setOutcome] = useState('sent'), [notes, setNotes] = useState('');
  useEffect(() => { api.get('/connection-desk').then(r => setData(r.data)).catch(e => setError(e.response?.data?.error || 'Could not load your LinkedIn desk.')); }, []);
  async function batch() {
    setBusy(true); setError(''); setNotice('');
    try { const { data: next } = await api.post('/connection-desk/batch', { limit }); setData(next); setSelected(null); setNotice(`Today’s queue contains ${next.contacts.length} contacts. Existing selections are kept when you synchronize again.`); }
    catch (e) { setError(e.response?.data?.error || 'Could not prepare the queue.'); }
    finally { setBusy(false); }
  }
  async function importFile(e) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true); setError(''); setNotice('');
    try {
      if (file.size > 5000000) throw new Error('Choose a Connections.csv file under 5 MB.');
      const { data: result } = await api.post('/connection-desk/import', { csv: await file.text() });
      const { data: next } = await api.post('/connection-desk/batch', { limit }); setData(next); setSelected(null);
      setNotice(`Checked ${result.received} connections: ${result.imported} relevant profiles imported (${result.withEmail} with shared email), ${result.duplicates} duplicates, ${result.outsideTarget} outside target roles, ${result.invalid} incomplete profiles. Emails are shared data, not independently verified.`);
    } catch (e) { setError(e.response?.data?.error || e.message || 'Import failed.'); }
    finally { setBusy(false); e.target.value = ''; }
  }
  function choose(c) { setSelected(c); setDraft(c.draft); setNotes(''); setOutcome('sent'); setNotice(''); }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setNotice('Message copied. Open the profile, choose Message, paste and send in LinkedIn.'); }
    catch { setNotice('Clipboard unavailable. Select and copy the message text, then paste it in LinkedIn.'); }
  }
  async function save(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { const { data: next } = await api.post(`/connection-desk/${selected.id}/outcome`, { state: outcome, notes }); setData(next); setSelected(null); setNotice('Your reported outcome was saved. This does not send a message.'); }
    catch (e) { setError(e.response?.data?.error || 'Could not save outcome.'); }
    finally { setBusy(false); }
  }
  const closed = selected && ['not_relevant', 'do_not_contact'].includes(selected.state);
  return <div className="sw-root">
    <header className="sw-heading"><div><span className="sw-kicker">MYN · EXISTING LINKEDIN CONNECTIONS</span><h1>Your daily LinkedIn shortlist</h1><p>Facilities, workplace, administration and purchasing contacts. Priority reflects the exported role, not confirmed buying interest.</p></div><button className="sw-primary" disabled={busy || !data} onClick={batch}>{busy ? 'Working…' : 'Synchronize shortlist'}</button></header>
    {error && <p className="sw-alert" role="alert">{error}</p>}{notice && <p className="sw-notice" role="status">{notice}</p>}
    <section className="sw-panel"><h2>Connect your existing network</h2><p>Import LinkedIn’s Connections.csv once. The app selects relevant roles automatically; you do not need to sort all your connections. The imported network belongs to your CRVM login.</p><div className="sw-link-row"><a href="https://www.linkedin.com/mypreferences/d/download-my-data" target="_blank" rel="noreferrer">Request LinkedIn export ↗</a></div><p className="sw-muted">LinkedIn → Settings & Privacy → Data privacy → Get a copy of your data. Download and unzip the archive, then select Connections.csv. The export may omit email, phone and location.</p><div className="sw-form"><label>LinkedIn Connections.csv<input type="file" accept=".csv,text/csv" disabled={busy} onChange={importFile} /></label><label>Daily selection size<select value={limit} onChange={e => setLimit(Number(e.target.value))}>{[10,15,25].map(n => <option key={n} value={n}>{n} profiles per day</option>)}</select></label></div></section>
    <section className="sw-panel"><div className="sw-row"><h2>{data ? `${data.day} · India time` : 'Loading shortlist…'}</h2><span className="sw-pill">{data?.contacts.length || 0} selected today</span></div><p>{data?.stats.total || 0} relevant profiles · {data?.stats.remaining || 0} not yet selected · {data?.stats.replied || 0} replies reported</p><p className="sw-muted">The queue uses each imported profile once. Refreshing keeps today’s selections. A new day’s Synchronize selects the next profiles. Numbers stop when the matching network is exhausted; contacts are not invented to meet a quota. Check whether the company has a Hyderabad requirement—the export does not confirm location.</p></section>
    <section className="sw-panel"><strong>Sending and reply tracking</strong><p>LinkedIn: copy the prepared message and open the profile to send it yourself. Automatic LinkedIn sending and inbox monitoring are not connected. Record replies below.</p><p>Email: the draft opens in your mail application when a shared email exists. Select sales@meetyourneeds.in as the sender there. Sending from CRVM and automatic email replies require the sales mailbox connection; opening a draft is not a sent email.</p></section>
    <div className="sw-prospect-grid">{data?.contacts.map(c => <button key={c.id} className="sw-prospect" onClick={() => choose(c)}><div className="sw-row"><span className="sw-pill">{c.state.replaceAll('_',' ')}</span><span className="sw-muted">1st-degree export</span></div><h2>{c.name}</h2><p>{c.title}</p><strong>{c.company}</strong><p>{c.reason}</p><p>{c.email || 'Email not shared in export'}</p><p>{c.phone || 'Phone not available in export'}</p><small>Open profile and prepared message →</small></button>)}</div>
    {data && !data.contacts.length && <section className="sw-panel sw-empty"><h2>{data.stats.remaining ? 'Prepare your daily shortlist' : 'No eligible profiles available yet'}</h2><p>{data.stats.remaining ? 'Click Synchronize shortlist to select from the imported connections.' : 'Import your LinkedIn connection export. A missing list is not counted as leads.'}</p></section>}
    {selected && <section className="sw-panel"><div className="sw-row"><h2>{selected.name} · {selected.company}</h2><button onClick={() => setSelected(null)}>Close profile</button></div><p>{selected.title}</p><p className="sw-muted">Source: your LinkedIn connection export. Imported {new Date(selected.importedAt.replace(' ','T') + 'Z').toLocaleDateString('en-IN')}. Role and contact details may have changed.</p>{closed ? <p>This contact is closed for outreach: {selected.state.replaceAll('_',' ')}.</p> : <><label className="sw-form">Prepared message<textarea rows={7} value={draft} onChange={e => setDraft(e.target.value)} /></label><div className="sw-link-row" style={{marginTop:16}}><button onClick={copy}>Copy message</button><a className="sw-primary" href={selected.profileUrl} target="_blank" rel="noreferrer">Open LinkedIn profile ↗</a>{selected.email && <a className="sw-primary" href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent('Facilities and renovation support — MYN')}&body=${encodeURIComponent(draft)}`}>Open email draft</a>}</div><h3>Record what happened</h3><form className="sw-form" onSubmit={save}><label>Outcome<select value={outcome} onChange={e => setOutcome(e.target.value)}>{Object.entries(states).map(([key,value]) => <option key={key} value={key}>{value}</option>)}</select></label><label>Message or reply notes<textarea required rows={3} maxLength={5000} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Record the actual conversation and agreed next step." /></label><button disabled={busy} className="sw-primary">Save reported outcome</button></form></>}{selected.notes && <p className="sw-prewrap">Latest note: {selected.notes}</p>}</section>}
    {!!data?.followups.length && <section className="sw-panel"><h2>Earlier conversations</h2><p className="sw-muted">Replies and previously messaged contacts remain available here for follow-up.</p>{data.followups.map(c => <div className="sw-history sw-row" key={c.id}><div><strong>{c.name} · {c.company}</strong><p>{c.state} · {c.notes}</p></div><button onClick={() => choose(c)}>Open</button></div>)}</section>}
  </div>;
}
