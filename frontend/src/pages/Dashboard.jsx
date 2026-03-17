import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/common/Pagination';
import './Dashboard.css';

const statusColors = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchApplications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/applications/my', { params: { page, limit: 10 } });
      setApplications(data.data.applications);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      updateUser(data.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const fallback = (pet) => `https://placehold.co/80x80/fdf6ec/6b4c3b?text=${encodeURIComponent(pet?.name || '?')}`;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name} 👋</p>
        </div>

        <div className="tab-nav">
          <button className={`tab-btn ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
            My Applications {pagination.total > 0 && <span className="tab-count">{pagination.total}</span>}
          </button>
          <button className={`tab-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            Profile
          </button>
        </div>

        {tab === 'applications' && (
          <div>
            {loading ? (
              <div className="spinner" />
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No applications yet</h3>
                <p>Browse our pets and apply to adopt one!</p>
                <a href="/pets" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Pets</a>
              </div>
            ) : (
              <>
                <div className="applications-list">
                  {applications.map((app) => (
                    <div key={app.id} className="application-card">
                      <img
                        src={app.pet?.photoUrl || fallback(app.pet)}
                        alt={app.pet?.name}
                        className="app-pet-img"
                        onError={(e) => { e.target.src = fallback(app.pet); }}
                      />
                      <div className="app-info">
                        <h3 className="app-pet-name">{app.pet?.name}</h3>
                        <p className="app-pet-meta">{app.pet?.breed || app.pet?.species} · {app.pet?.age} {app.pet?.ageUnit}</p>
                        {app.message && <p className="app-message">"{app.message.slice(0, 100)}{app.message.length > 100 ? '…' : ''}"</p>}
                        {app.adminNotes && <p className="app-admin-note">📝 {app.adminNotes}</p>}
                      </div>
                      <div className="app-meta">
                        <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                        <span className="app-date">{new Date(app.createdAt).toLocaleDateString()}</span>
                        {app.reviewedAt && <span className="app-date">Reviewed: {new Date(app.reviewedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination pagination={pagination} onPageChange={fetchApplications} />
              </>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <h2 className="profile-name">{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
                <span className={`badge badge-${user?.role}`}>{user?.role}</span>
              </div>
            </div>
            <form onSubmit={handleProfileSave} className="profile-form">
              <h3 style={{ marginBottom: 20 }}>Edit Profile</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={profileForm.name} onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" value={profileForm.phone} onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="Your phone number" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-control" value={profileForm.address} onChange={(e) => setProfileForm(f => ({ ...f, address: e.target.value }))} rows={3} placeholder="Your home address" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
