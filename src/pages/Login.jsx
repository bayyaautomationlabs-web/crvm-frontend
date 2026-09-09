import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRound, LockKeyhole } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check the email and password, then try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crvm-login">
      <span className="crvm-module-tag">MODULE: AUTH_V2.0.4.SYS</span>
      <div className="crvm-login-hero" aria-hidden="true"><img src="/assets/hero.png" alt="" /></div>
      <main className="crvm-login-stage">
        <div className="crvm-login-left">
          <div className="crvm-brandbar"><div className="crvm-brand-text"><div className="crvm-suit-title">CRVM SUIT</div><div className="crvm-subline"><span>B<span className="crvm-at">@</span>YY<span className="crvm-at">@</span> | AUTOMATION LABS</span></div></div><span className="crvm-pulse" /></div>
          <section className="crvm-auth-card">
            <div className="crvm-card-body">
              <div className="crvm-auth-head"><span className="crvm-avatar"><UserRound size={21} /></span><div><h1>Identity Verification</h1><p>Enter your operational credentials to proceed.</p></div></div>
              <form onSubmit={handleSubmit} className="crvm-auth-form" autoComplete="off">
                <div className="crvm-field"><label htmlFor="login-email">Official Email</label><input id="login-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="contact@company.com" /><UserRound size={16} /></div>
                <div className="crvm-field"><label htmlFor="login-password">Access Key</label><input id="login-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••••" /><LockKeyhole size={16} /></div>
                <button className="crvm-auth-button" type="submit" disabled={loading}><span>{loading ? 'Initializing...' : 'Initialize Session'}</span><span className="crvm-bolt">⚡</span></button>
                {error && <div className="crvm-auth-error">{error}</div>}
              </form>
              <div className="crvm-terminal-chip"><span className="crvm-terminal-icon">&gt;_</span><div><div>[{new Date().toLocaleTimeString()}] System kernel successfully loaded...</div><div>[{new Date().toLocaleTimeString()}] <b>Ready for input</b> <span className="crvm-caret" /></div></div></div>
            </div>
            <div className="crvm-card-foot"><Link to="/register">Request access</Link><span>Secure environment [BAL-882]</span></div>
          </section>
        </div>
      </main>
      <footer className="crvm-login-footer"><div><span className="crvm-footer-icon">⌁</span><div><b>Secure environment</b><small>[BAL-882]</small></div></div><div><span className="crvm-footer-icon">▤</span><div><b>Operations network</b><small>CRVM customer, sales-lead, and vendor controls. Authorization required.</small></div></div><div><span className="crvm-footer-icon">◈</span><div><b>B@YY@ | Automation Labs</b><small>Customer Relationship & Vendor Management</small></div></div></footer>
    </div>
  );
}
