import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Phone, RefreshCw } from 'lucide-react';

const sections = [
  ['Dashboard', 'Start here each morning. Review new prospects, vendors, pipeline value, and activity by date.', 'Use it for visibility only; it does not create leads.'],
  ['Leads & Call Guide', 'Open a Hyderabad prospect, read the company profile and source, then use the recorded phone number to call.', 'Record only what the person actually says. Never invent a contact, budget, project, or requirement.'],
  ['Vendor Register', 'Store suppliers and service providers separately from sales prospects. Review phone, website, category, and materials notes.', 'A vendor is not a sales lead and should not be moved through the sales pipeline.'],
  ['Daily Report', 'Review new prospects, new vendors, calls, interested conversations, and site visits by India date.', 'Use this for the end-of-day report to MYN management.'],
  ['CRM Pipeline', 'Move a prospect from New to Contacted, Discussion, Site Visit, BOQ Sent, Negotiation, Won, or Lost only when the conversation supports it.', 'A listing alone is not a buying requirement.'],
    ['Synchronize', 'After a verified source run, import source-backed Hyderabad business records and see duplicates and rejected rows.', 'Apify is disabled. Do not run the old scenario. A free directory source can produce prospects, but it cannot promise 10 new buying requirements every day.'],
  ['Settings', 'Maintain MYN company details and approved integration settings.', 'Change values only when you have the official value.'],
];

export default function Training() {
  return <div className="sw-root">
    <header className="sw-heading"><div><span className="sw-kicker">CRVM SUIT · SALES TRAINING</span><h1>How to use CRVM, step by step</h1><p>Follow this routine to turn verified business conversations into recorded opportunities.</p></div><Link className="sw-primary" to="/leads"><Phone size={16} /> Open sales desk</Link></header>
    <section className="sw-panel sw-guide"><div className="sw-row"><span className="sw-pill"><CheckCircle2 size={14} /> Safe operating rule</span><span className="sw-muted">No fake profiles · no invented requirements · no automatic LinkedIn messages</span></div><h2>Daily routine</h2><ol className="sw-steps"><li><strong>Dashboard:</strong> check yesterday’s additions and today’s follow-ups.</li><li><strong>Leads & Call Guide:</strong> open each Hyderabad prospect and read the source.</li><li><strong>Call:</strong> use the business phone and introduce MYN clearly.</li><li><strong>Record:</strong> select the real outcome, write notes, and add the agreed follow-up date.</li><li><strong>Daily Report:</strong> review calls, interested conversations, and visits before closing the day.</li></ol></section>
    <section className="sw-training-grid">{sections.map(([title, use, tip], index) => <article className="sw-panel" key={title}><div className="sw-row"><span className="sw-step-number">{index + 1}</span><span className="sw-kicker">{title}</span></div><h2>{use}</h2><p className="sw-muted"><strong>Tip:</strong> {tip}</p></article>)}</section>
    <section className="sw-panel"><div className="sw-row"><span className="sw-pill"><RefreshCw size={14} /> Live source status</span><Link to="/make-scenarios">Open Synchronize →</Link></div><h2>What must be connected before live leads arrive?</h2><p>Google Places requires billing-enabled API access. A genuinely free alternative is OpenStreetMap/Overpass for directory prospects, with attribution and rate limits. Foursquare Places is another optional developer source with a free allowance, but it needs a token.</p><p>LinkedIn data must come from an official Lead Gen Form, Page/Event lead, or approved Lead Sync API access. LinkedIn profile scraping and automatic connection/message sending are not safe or supported.</p><p className="sw-muted">Safe flow: source → Hyderabad/business filter → duplicate check → CRVM → Priyadarsini’s call guide → daily report. The app will show the real received/new/duplicate/rejected counts; it will never fill the dashboard with fake leads.</p></section>
  </div>;
}
