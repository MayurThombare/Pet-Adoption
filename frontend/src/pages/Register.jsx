import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to PawsHome, ${user.name.split(' ')[0]}! 🐾`);
      navigate('/pets');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="auth-logo">🐾</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join PawsHome and find your perfect pet</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" className="form-control" placeholder="Jane Doe" value={form.name} onChange={handle} required minLength={2} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" name="phone" className="form-control" placeholder="+1 234 567 8900" value={form.phone} onChange={handle} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" name="email" className="form-control" placeholder="jane@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" name="password" className="form-control" placeholder="At least 6 characters" value={form.password} onChange={handle} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea name="address" className="form-control" placeholder="Your home address (optional)" value={form.address} onChange={handle} rows={2} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
