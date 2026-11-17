import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast('Login successful! Welcome back.', 'success');
      navigate('/account');
    } catch (err) {
      showToast(err.message || 'Login failed. Check credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@retailhub.com');
    setPassword('password123');
    try {
      await login('demo@retailhub.com', 'password123');
      showToast('Logged in as Demo Customer!', 'success');
      navigate('/account');
    } catch (err) {
      showToast('Demo login failed', 'error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await authService.resetPassword(forgotEmail);
    showToast('Password reset link sent to your email!', 'info');
    setShowForgotModal(false);
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
          Customer Login
        </h1>
        <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          Sign in to access your orders, track shipments, and manage profile
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                required
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <div className="flex-between" style={{ marginBottom: '0.375rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-control"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '1rem' }} disabled={isSubmitting}>
            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <button onClick={handleDemoLogin} className="btn btn-outline" style={{ width: '100%', marginBottom: '1.5rem' }}>
          <UserCheck size={18} />
          <span>Quick Demo Customer Login</span>
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <span>Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an account</Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reset Password</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Enter your registered email address and we will send you a password recovery link.
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForgotModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Send Reset Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
