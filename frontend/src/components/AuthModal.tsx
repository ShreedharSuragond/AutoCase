import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [team, setTeam] = useState('QA Automation Core');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

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
        if (!res.success) setError(res.message || 'Invalid credentials');
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
    <div className="modal-backdrop">
      <div className="modal-container auth-modal">
        <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Close">
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={24} className="text-primary" />
          </div>
          <h2>{isRegister ? 'Create Your AutoCase Account' : 'Sign in to AutoCase AI'}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Join your QA engineering workspace with secure enterprise RBAC'
              : 'Enter your credentials to access your projects and test automations'}
          </p>
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
            {submitting ? 'Authenticating...' : isRegister ? 'Create Account & Sign In' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch-mode">
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
          >
            {isRegister ? 'Sign in instead' : 'Create an account'}
          </button>
        </div>

        <div className="quick-login-divider">
          <span>Quick Demo Access</span>
        </div>

        <div className="quick-login-buttons">
          <button
            type="button"
            className="quick-login-btn"
            onClick={() => handleQuickLogin('automation.user@autocase.ai', 'AutoCase@123')}
          >
            <CheckCircle2 size={16} className="text-success" />
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
            <Shield size={16} className="text-primary" />
            <div>
              <span className="quick-role">Administrator</span>
              <span className="quick-email">admin@autocase.ai</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
