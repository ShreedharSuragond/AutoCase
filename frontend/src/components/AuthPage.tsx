import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Shield, Code2, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [team, setTeam] = useState('QA Automation Core');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        const res = await register(fullName, email, password, team);
        if (!res.success) setError(res.message || 'Registration failed');
      } else {
        const res = await login(email, password);
        if (!res.success) setError(res.message || 'Invalid email or password');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
    setSubmitting(true);
    try {
      const res = await login(quickEmail, quickPass);
      if (!res.success) setError(res.message || 'Quick login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-card">
        <div className="auth-page-brand">
          <div className="brand-logo-container large">
            <Code2 size={28} className="brand-icon" />
          </div>
          <h1>AutoCase AI</h1>
          <p className="auth-page-tagline">
            AI-Powered Test Automation Generation & Governance Platform
          </p>
        </div>

        <div className="auth-tabs-toggle">
          <button
            type="button"
            className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="auth-error-alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <UserIcon size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Engineering Team</label>
                <div className="input-with-icon">
                  <Shield size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Core Healthcare QA"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Work Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={submitting}>
            <span>{submitting ? 'Authenticating...' : isRegister ? 'Create Account & Sign In' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="quick-login-divider">
          <span>One-Click Demo Credentials (from DB)</span>
        </div>

        <div className="quick-login-buttons">
          <button
            type="button"
            className="quick-login-btn"
            onClick={() => handleQuickLogin('automation.user@autocase.ai', 'AutoCase@123')}
          >
            <CheckCircle2 size={18} className="text-green" />
            <div>
              <span className="quick-role">QA Engineer</span>
              <span className="quick-email">automation.user@autocase.ai</span>
            </div>
          </button>

          <button
            type="button"
            className="quick-login-btn"
            onClick={() => handleQuickLogin('admin@autocase.ai', 'Admin@123')}
          >
            <Shield size={18} className="text-primary" />
            <div>
              <span className="quick-role">Administrator</span>
              <span className="quick-email">admin@autocase.ai</span>
            </div>
          </button>
        </div>

        <div className="auth-security-notice">
          <span>🔒 Protected by Spring Security with JWT HttpOnly Cookie Session</span>
        </div>
      </div>
    </div>
  );
};
