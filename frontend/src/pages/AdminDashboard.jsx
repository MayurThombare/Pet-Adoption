import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Pagination from '../components/common/Pagination';
import PetFormModal from '../components/admin/PetFormModal';
import ApplicationReviewModal from '../components/admin/ApplicationReviewModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [tab, setTab] = useState('pets');

  // Pets state
  const [pets, setPets] = useState([]);
  const [petsPagination, setPetsPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 10 });
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsSearch, setPetsSearch] = useState('');
  const [petsStatus, setPetsStatus] = useState('');
  const [showPetForm, setShowPetForm] = useState(false);
  const [editPet, setEditPet] = useState(null);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [appsPagination, setAppsPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 10 });
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsStatus, setAppsStatus] = useState('');
  const [reviewApp, setReviewApp] = useState(null);

  // Stats
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const [petsRes, appsRes] = await Promise.all([
        api.get('/pets', { params: { limit: 1 } }),
        api.get('/applications', { params: { limit: 1 } }),
      ]);
      const [availRes, pendRes, adoptRes] = await Promise.all([
        api.get('/pets', { params: { status: 'available', limit: 1 } }),
        api.get('/pets', { params: { status: 'pending', limit: 1 } }),
        api.get('/pets', { params: { status: 'adopted', limit: 1 } }),
      ]);
      setStats({
        totalPets: petsRes.data.data.pagination.total,
        totalApps: appsRes.data.data.pagination.total,
        available: availRes.data.data.pagination.total,
        pending: pendRes.data.data.pagination.total,
        adopted: adoptRes.data.data.pagination.total,
      });
    } catch {}
  }, []);

  const fetchPets = useCallback(async (page = 1) => {
    setPetsLoading(true);
    try {
      const params = { page, limit: 10 };
      if (petsSearch) params.search = petsSearch;
      if (petsStatus) params.status = petsStatus;
      const { data } = await api.get('/pets', { params });
      setPets(data.data.pets);
      setPetsPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load pets');
    } finally {
      setPetsLoading(false);
    }
  }, [petsSearch, petsStatus]);

  const fetchApplications = useCallback(async (page = 1) => {
    setAppsLoading(true);
    try {
      const params = { page, limit: 10 };
      if (appsStatus) params.status = appsStatus;
      const { data } = await api.get('/applications', { params });
      setApplications(data.data.applications);
      setAppsPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setAppsLoading(false);
    }
  }, [appsStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (tab === 'pets') fetchPets(1); }, [tab, fetchPets]);
  useEffect(() => { if (tab === 'applications') fetchApplications(1); }, [tab, fetchApplications]);

  const handleDeletePet = async (pet) => {
    if (!window.confirm(`Delete ${pet.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/pets/${pet.id}`);
      toast.success(`${pet.name} deleted`);
      fetchPets(1);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (pet, status) => {
    try {
      await api.patch(`/pets/${pet.id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchPets(petsPagination.page);
      fetchStats();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePetSaved = () => {
    setShowPetForm(false);
    setEditPet(null);
    fetchPets(1);
    fetchStats();
    toast.success(editPet ? 'Pet updated!' : 'Pet added!');
  };

  const handleReviewDone = () => {
    setReviewApp(null);
    fetchApplications(appsPagination.page);
    fetchStats();
  };

  const fallback = (pet) => `https://placehold.co/56x56/fdf6ec/6b4c3b?text=${encodeURIComponent(pet?.name?.[0] || '?')}`;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header admin-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Manage pets and adoption applications</p>
          </div>
          {tab === 'pets' && (
            <button className="btn btn-primary" onClick={() => { setEditPet(null); setShowPetForm(true); }}>
              + Add New Pet
            </button>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            {[
              { label: 'Total Pets', value: stats.totalPets, emoji: '🐾', color: 'bark' },
              { label: 'Available', value: stats.available, emoji: '✅', color: 'green' },
              { label: 'Pending', value: stats.pending, emoji: '⏳', color: 'amber' },
              { label: 'Adopted', value: stats.adopted, emoji: '🏠', color: 'blue' },
              { label: 'Applications', value: stats.totalApps, emoji: '📋', color: 'bark' },
            ].map((s) => (
              <div key={s.label} className={`admin-stat-card stat-${s.color}`}>
                <span className="admin-stat-emoji">{s.emoji}</span>
                <strong className="admin-stat-val">{s.value}</strong>
                <span className="admin-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="tab-nav">
          <button className={`tab-btn ${tab === 'pets' ? 'active' : ''}`} onClick={() => setTab('pets')}>🐾 Pets</button>
          <button className={`tab-btn ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>📋 Applications</button>
        </div>

        {/* PETS TAB */}
        {tab === 'pets' && (
          <div>
            <div className="admin-filters">
              <input
                className="form-control"
                placeholder="Search pets…"
                value={petsSearch}
                onChange={(e) => setPetsSearch(e.target.value)}
                style={{ maxWidth: 260 }}
              />
              <select className="form-control" value={petsStatus} onChange={(e) => setPetsStatus(e.target.value)} style={{ maxWidth: 180 }}>
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>

            {petsLoading ? <div className="spinner" /> : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Pet</th>
                        <th>Species / Breed</th>
                        <th>Age</th>
                        <th>Size</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pets.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--bark-muted)', padding: 40 }}>No pets found</td></tr>
                      ) : pets.map((pet) => (
                        <tr key={pet.id}>
                          <td>
                            <div className="admin-pet-cell">
                              <img src={pet.photoUrl || fallback(pet)} alt={pet.name} className="admin-pet-thumb" onError={(e) => { e.target.src = fallback(pet); }} />
                              <span className="admin-pet-name">{pet.name}</span>
                            </div>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</td>
                          <td>{pet.age} {pet.ageUnit}</td>
                          <td style={{ textTransform: 'capitalize' }}>{pet.size}</td>
                          <td>
                            <select
                              className="status-select"
                              value={pet.status}
                              onChange={(e) => handleStatusChange(pet, e.target.value)}
                            >
                              <option value="available">Available</option>
                              <option value="pending">Pending</option>
                              <option value="adopted">Adopted</option>
                            </select>
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn btn-ghost btn-sm" onClick={() => { setEditPet(pet); setShowPetForm(true); }}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeletePet(pet)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination pagination={petsPagination} onPageChange={fetchPets} />
              </>
            )}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {tab === 'applications' && (
          <div>
            <div className="admin-filters">
              <select className="form-control" value={appsStatus} onChange={(e) => setAppsStatus(e.target.value)} style={{ maxWidth: 200 }}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {appsLoading ? <div className="spinner" /> : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Pet</th>
                        <th>Applicant</th>
                        <th>Status</th>
                        <th>Applied</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--bark-muted)', padding: 40 }}>No applications found</td></tr>
                      ) : applications.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <div className="admin-pet-cell">
                              <img src={app.pet?.photoUrl || fallback(app.pet)} alt={app.pet?.name} className="admin-pet-thumb" onError={(e) => { e.target.src = fallback(app.pet); }} />
                              <span className="admin-pet-name">{app.pet?.name}</span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{app.user?.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--bark-muted)' }}>{app.user?.email}</div>
                            </div>
                          </td>
                          <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--bark-muted)' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button className="btn btn-secondary btn-sm" onClick={() => setReviewApp(app)}>
                              {app.status === 'pending' ? 'Review' : 'View'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination pagination={appsPagination} onPageChange={fetchApplications} />
              </>
            )}
          </div>
        )}
      </div>

      {showPetForm && (
        <PetFormModal
          pet={editPet}
          onClose={() => { setShowPetForm(false); setEditPet(null); }}
          onSaved={handlePetSaved}
        />
      )}

      {reviewApp && (
        <ApplicationReviewModal
          application={reviewApp}
          onClose={() => setReviewApp(null)}
          onDone={handleReviewDone}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
