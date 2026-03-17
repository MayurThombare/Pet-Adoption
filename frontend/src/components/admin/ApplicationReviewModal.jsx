import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ApplicationReviewModal = ({ application: app, onClose, onDone }) => {
  const [adminNotes, setAdminNotes] = useState(app.adminNotes || '');
  const [loading, setLoading] = useState('');

  const review = async (status) => {
    setLoading(status);
    try {
      await api.patch(`/applications/${app.id}/review`, { status, adminNotes });
      toast.success(`Application ${status}`);
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally {
      setLoading('');
    }
  };

  const fallback = `https://placehold.co/80x80/fdf6ec/6b4c3b?text=${encodeURIComponent(app.pet?.name?.[0] || '?')}`;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Review Application</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Pet info */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--cream)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 20 }}>
          <img src={app.pet?.photoUrl || fallback} alt={app.pet?.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }} onError={(e) => { e.target.src = fallback; }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{app.pet?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--bark-muted)', textTransform: 'capitalize' }}>{app.pet?.species} · {app.pet?.breed}</p>
            <span className={`badge badge-${app.status}`} style={{ marginTop: 6 }}>{app.status}</span>
          </div>
        </div>

        {/* Applicant info */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--bark-muted)', marginBottom: 12 }}>Applicant</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Name', app.user?.name],
              ['Email', app.user?.email],
              ['Phone', app.user?.phone || '—'],
              ['Home Type', app.homeType || '—'],
              ['Has Yard', app.hasYard ? 'Yes' : 'No'],
              ['Has Children', app.hasChildren ? 'Yes' : 'No'],
              ['Has Other Pets', app.hasOtherPets ? 'Yes' : 'No'],
            ].map(([label, val]) => (
              <div key={label} style={{ fontSize: '0.87rem' }}>
                <span style={{ color: 'var(--bark-muted)', display: 'block', fontSize: '0.78rem', marginBottom: 2 }}>{label}</span>
                <strong style={{ color: 'var(--bark)' }}>{val}</strong>
              </div>
            ))}
          </div>

          {app.otherPetsDescription && (
            <div style={{ marginTop: 10, fontSize: '0.87rem' }}>
              <span style={{ color: 'var(--bark-muted)', display: 'block', fontSize: '0.78rem', marginBottom: 2 }}>Other Pets Description</span>
              <p>{app.otherPetsDescription}</p>
            </div>
          )}

          {app.message && (
            <div style={{ marginTop: 14, background: 'var(--cream)', borderRadius: 'var(--radius)', padding: 14 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--bark-muted)', marginBottom: 4 }}>Applicant's Message</p>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"{app.message}"</p>
            </div>
          )}

          {app.experience && (
            <div style={{ marginTop: 10, fontSize: '0.87rem' }}>
              <span style={{ color: 'var(--bark-muted)', display: 'block', fontSize: '0.78rem', marginBottom: 2 }}>Pet Experience</span>
              <p>{app.experience}</p>
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Admin Notes</label>
          <textarea
            className="form-control"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Optional notes to send to applicant…"
            disabled={app.status !== 'pending'}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          {app.status === 'pending' && (
            <>
              <button className="btn btn-danger" onClick={() => review('rejected')} disabled={!!loading}>
                {loading === 'rejected' ? 'Rejecting…' : '✕ Reject'}
              </button>
              <button className="btn btn-success" onClick={() => review('approved')} disabled={!!loading}>
                {loading === 'approved' ? 'Approving…' : '✓ Approve'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewModal;
