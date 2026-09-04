import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRound, LockKeyhole, Mail, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('sales');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crvm-login">
      <span className="crvm-module-tag">MODULE: ACCESS_PROVISIONING_V1.0</span>
      <div className="crvm-login-hero" aria-hidden="true"><img src="/assets/hero.png" alt="" /></div>
      <main className="crvm-login-stage">
        <div className="crvm-login-left">
          <div className="crvm-brandbar"><div className="crvm-brand-text"><div className="crvm-suit-title">CRVM SUIT</div><div className="crvm-subline"><span>B<span className="crvm-at">@</span>YY<span className="crvm-at">@</span> | AUTOMATION LABS</span></div></div><span className="crvm-pulse" /></div>
          <section className="crvm-auth-card">
            <div className="crvm-card-body">
              <div className="crvm-auth-head"><span className="crvm-avatar"><UserRound size={21} /></span><div><h1>Request Access</h1><p>Create a CRVM operational account.</p></div></div>
              <form onSubmit={handleSubmit} className="crvm-auth-form" autoComplete="off">
                <div className="crvm-field"><label htmlFor="register-name">Full Name</label><input id="register-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /><UserRound size={16} /></div>
                <div className="crvm-field"><label htmlFor="register-email">Official Email</label><input id="register-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /><Mail size={16} /></div>
                <div className="crvm-field"><label htmlFor="register-password">Access Key</label><input id="register-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" /><LockKeyhole size={16} /></div>
                <div className="crvm-field"><label htmlFor="register-role">Role</label><select id="register-role" value={role} onChange={(event) => setRole(event.target.value)}><option value="sales">Sales Executive</option><option value="manager">Project / Sales Manager</option><option value="admin">Administrator</option></select></div>
                <button className="crvm-auth-button" type="submit" disabled={loading}><span>{loading ? 'Provisioning...' : 'Create Account'}</span><span className="crvm-bolt"><ArrowRight size={16} /></span></button>
                {error && <div className="crvm-auth-error">{error}</div>}
              </form>
            </div>
            <div className="crvm-card-foot"><Link to="/login">Return to sign in</Link><span>Secure environment [BAL-882]</span></div>
          </section>
        </div>
      </main>
      <footer className="crvm-login-footer"><div><span className="crvm-footer-icon">⌁</span><div><b>Secure environment</b><small>[BAL-882]</small></div></div><div><span className="crvm-footer-icon">▤</span><div><b>Operations network</b><small>Authorization required to access CRVM controls.</small></div></div><div><span className="crvm-footer-icon">◈</span><div><b>B@YY@ | Automation Labs</b><small>Customer Relationship & Vendor Management</small></div></div></footer>
    </div>
  );
}
