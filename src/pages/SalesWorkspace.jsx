import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './sales-workspace.css';
const outcomes = { no_answer: 'No answer', callback: 'Callback requested', interested: 'Interested — requirement discussed', site_visit: 'Site visit agreed', not_interested: 'Not interested', wrong_number: 'Wrong number', do_not_contact: 'Do not contact' };
const label = value => String(value || 'Not recorded').replaceAll('_', ' ');
const date = value => value ? new Date(value.includes('T') ? value : value.replace(' ', 'T') + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Not scheduled';
function SourceLink({ value, children }) { let url; try { url = new URL(value); } catch {} return url && ['http:', 'https:'].includes(url.protocol) ? <a href={url.href} target="_blank" rel="noreferrer">{children} <ExternalLink size={13} /></a> : <span className="sw-muted">{children}: not available</span>; }
export default function SalesWorkspace() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]), [selected, setSelected] = useState(null), [detail, setDetail] = useState(null);
  const [search, setSearch] = useState(''), [page, setPage] = useState(0), [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState(''), [saving, setSaving] = useState(false);
  const emptyForm = { outcome: 'no_answer', notes: '', nextFollowUpAt: '' };
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try { const { data } = await api.get('/leads', { params: { recordType: 'lead', city: 'Hyderabad', limit: 51, offset: page * 50, search } }); if (!cancelled) { setLeads(data.leads.slice(0,50)); setHasMore(data.leads.length > 50); } }
      catch (e) { if (!cancelled) setError(e.response?.data?.error || 'Could not load prospects. Please refresh.'); }
      finally { if (!cancelled) setLoading(false); }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [search, page]);
  useEffect(() => {
    if (!selected) return;
    let cancelled = false; setDetail(null); setError('');
    api.get(`/sales/leads/${selected}`).then(({data}) => { if (!cancelled) setDetail(data); }).catch(e => { if (!cancelled) setError(e.response?.data?.error || 'Could not open the profile.'); });
    return () => { cancelled = true; };
  }, [selected]);
  async function saveCall(e) {
    e.preventDefault(); setSaving(true); setError(''); setNotice('');
    try {
      await api.post(`/sales/leads/${selected}/calls`, { ...form, nextFollowUpAt: form.nextFollowUpAt ? new Date(form.nextFollowUpAt).toISOString() : null });
      const { data } = await api.get(`/sales/leads/${selected}`); setDetail(data); setLeads(list => list.map(l => l.id === data.lead.id ? data.lead : l));
      setForm(emptyForm); setNotice('Call outcome saved. Follow-up and reporting have been updated.');
    } catch (e) { setError(e.response?.data?.error || 'Could not save. Your notes are still here; please retry.'); }
    finally { setSaving(false); }
  }
  const lead = detail?.lead, guide = detail?.guide;
  return <div className="sw-root">
    <header className="sw-heading"><div><span className="sw-kicker">MYN SALES DESK</span><h1>{selected ? 'Lead profile & call guide' : 'Your next conversation starts here'}</h1><p>Read the source. Understand the business. Record the conversation.</p></div>{selected ? <button onClick={() => { setSelected(null); setNotice(''); }}><ArrowLeft size={16} />All prospects</button> : <Link className="sw-primary" to="/make-scenarios"><RefreshCw size={16} />Synchronize</Link>}</header>
    {error && <div className="sw-alert" role="alert">{error}</div>}{notice && <div className="sw-notice" role="status">{notice}</div>}
    {!selected ? <>
      <section className="sw-panel"><input aria-label="Search prospects" className="sw-search" placeholder="Search company, person, email or phone" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} /></section>
      <p className="sw-muted">A prospect is not a confirmed buying requirement. Open the profile before making contact.</p>
      <div className="sw-prospect-grid">{leads.map(item => <button className="sw-prospect" key={item.id} onClick={() => { setSelected(item.id); setForm(emptyForm); }}><div className="sw-row"><span className="sw-pill">{item.doNotContact ? 'Do not contact' : label(item.status)}</span><span className="sw-muted">{label(item.source)}</span></div><h2>{item.company}</h2><p>{item.name === 'Unknown Contact' ? 'Contact person not identified' : item.name}</p><p>{[item.city, label(item.category)].filter(Boolean).join(' · ')}</p><div className="sw-contact">{item.phone || 'Phone not available'}</div><small>{item.nextFollowUpAt ? `Follow-up: ${date(item.nextFollowUpAt)} IST` : 'Open profile and prepare call →'}</small></button>)}</div>
      {!leads.length && <section className="sw-panel sw-empty"><h2>{loading ? 'Loading prospects…' : 'No prospects in this view'}</h2><p>{loading ? 'Fetching saved records.' : 'Source-backed prospects will appear after a connected acquisition run. Check Synchronize for setup and run status.'}</p></section>}
      <div className="sw-row"><button disabled={!page || loading} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page + 1}</span><button disabled={!hasMore || loading} onClick={() => setPage(p => p + 1)}>Next</button></div>
    </> : !detail ? <section className="sw-panel">{error ? 'Profile unavailable.' : 'Loading profile…'}</section> : <>
      <div className="sw-two-columns"><section className="sw-panel"><span className="sw-kicker">RECORDED BUSINESS DETAILS</span><h2>{lead.company}</h2><span className="sw-pill">{lead.doNotContact ? 'Do not contact' : label(lead.status)}</span><dl className="sw-facts">{[['Contact', lead.name === 'Unknown Contact' ? '' : lead.name], ['Role', lead.title], ['Phone', lead.phone], ['Email', lead.email], ['Location', [lead.address, lead.city, lead.state].filter(Boolean).join(', ')], ['Service category', label(lead.category)], ['Assigned to', lead.assignedTo], ['Collected', date(lead.createdAt)], ['Next follow-up', date(lead.nextFollowUpAt)]].map(([key,value]) => <React.Fragment key={key}><dt>{key}</dt><dd>{value || 'Not available'}</dd></React.Fragment>)}</dl><div className="sw-link-row"><SourceLink value={lead.sourceUrl}>Original source</SourceLink><SourceLink value={lead.website}>Company website</SourceLink></div><p className="sw-muted">Source: {label(lead.source)}. Review the listing before calling. A company profile is not proof of a decision-maker’s identity.</p><h3>Recorded notes</h3><p className="sw-prewrap">{lead.notes || 'No requirement recorded yet.'}</p>{lead.phone && !lead.doNotContact && <a className="sw-primary" href={`tel:${lead.phone.replace(/[^+\d]/g, '')}`}><Phone size={16} />Call business</a>}</section>
      <section className="sw-panel sw-guide"><span className="sw-kicker">PREPARE BEFORE CALLING</span><h2>Short pitch & speaking notes</h2><p className="sw-muted">{guide.label}</p><h3>1. Introduce yourself</h3><p>{guide.opening}</p><h3>2. Ask about a relevant need</h3><p>{guide.pitch}</p><h3>3. Discover the requirement</h3><ul>{guide.questions.map(q => <li key={q}>{q}</li>)}</ul><h3>4. Agree the next step</h3><p>{guide.closing}</p><p className="sw-guidance">{guide.objection}</p><small>{guide.qualification}</small></section></div>
      <div className="sw-two-columns"><section className="sw-panel"><h2>Record your call</h2><p className="sw-muted">Saved under {user?.name}. Recording an outcome does not make a call automatically.</p>{lead.doNotContact ? <p className="sw-alert">This person has requested no further contact.</p> : <form onSubmit={saveCall} className="sw-form"><label>Call outcome<select value={form.outcome} onChange={e => setForm({...form,outcome:e.target.value})}>{Object.entries(outcomes).map(([value,name]) => <option key={value} value={value}>{name}</option>)}</select></label><label>What did the person actually say?<textarea required maxLength={5000} rows={5} placeholder="Requirement, decision-maker, location, budget, timeline and agreed next step." value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} /></label><label>Agreed follow-up / visit time (your device timezone)<input type="datetime-local" required={['callback','site_visit'].includes(form.outcome)} value={form.nextFollowUpAt} onChange={e => setForm({...form,nextFollowUpAt:e.target.value})} /></label><button className="sw-primary" disabled={saving}>{saving ? 'Saving…' : 'Save call outcome'}</button></form>}</section><section className="sw-panel"><h2>Conversation history</h2>{!detail.calls.length && <p className="sw-muted">No calls recorded. No contact or interest is assumed.</p>}{detail.calls.map(call => <article className="sw-history" key={call.id}><strong>{outcomes[call.outcome] || label(call.outcome)}</strong><small>{call.userName} · {date(call.createdAt)} IST</small><p className="sw-prewrap">{call.notes}</p>{call.nextFollowUpAt && <small>Next: {date(call.nextFollowUpAt)} IST</small>}</article>)}</section></div>
    </>}
  </div>;
}
export function DailyReport() {
  const [data,setData] = useState(null), [error,setError] = useState('');
  useEffect(() => { api.get('/sales/daily-report').then(r => setData(r.data)).catch(() => setError('Daily report could not load. Please refresh.')); }, []);
  const dates = [...new Set([...(data?.additions || []).map(r => r.date), ...(data?.calls || []).map(r => r.date)])].sort().reverse();
  return <div className="sw-root"><header className="sw-heading"><div><span className="sw-kicker">DAILY ACTIVITY · INDIA TIME</span><h1>Acquisition & sales report</h1><p>Saved records and salesperson activity for the last 30 days.</p></div><Link to="/leads">Open sales desk →</Link></header>{error && <p role="alert" className="sw-alert">{error}</p>}<section className="sw-panel"><h2>Follow-ups due {data ? `(${data.due.length})` : ''}</h2>{data?.due.map(lead => <div className="sw-history" key={lead.id}><strong>{lead.company}</strong><p>{date(lead.nextFollowUpAt)} IST · {lead.assignedTo || 'Unassigned'}</p></div>)}{data && !data.due.length && <p>No overdue follow-ups recorded.</p>}</section><section className="sw-panel sw-table-wrap"><table><thead><tr>{['Date','New prospects','New vendors','Calls logged','Interested calls','Visits agreed'].map(s => <th key={s}>{s}</th>)}</tr></thead><tbody>{dates.map(day => { const a = data.additions.find(r => r.date === day) || {}, c = data.calls.find(r => r.date === day) || {}; return <tr key={day}><td>{day}</td>{[a.prospects,a.vendors,c.calls,c.interested,c.visits].map((v,i) => <td key={i}>{v || 0}</td>)}</tr>; })}</tbody></table>{!dates.length && <p>{data ? 'No acquisition or call activity recorded yet.' : error ? 'Report unavailable.' : 'Loading recorded activity…'}</p>}<p className="sw-muted">Calls and visits are logged events, not unique customers or completed visits. A refreshed prospect is not newly acquired.</p></section></div>;
}
