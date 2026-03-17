import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PetDetail.css';

const PetDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    message: '', homeType: 'house', hasYard: false,
    hasOtherPets: false, otherPetsDescription: '', hasChildren: false, experience: ''
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data } = await api.get(`/pets/${id}`);
        setPet(data.data.pet);
      } catch {
        toast.error('Pet not found');
        navigate('/pets');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await api.post('/applications', { petId: id, ...form });
      toast.success('Application submitted! We\'ll be in touch soon. 🐾');
      setShowForm(false);
      const { data } = await api.get(`/pets/${id}`);
      setPet(data.data.pet);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackImg = `https://placehold.co/600x400/fdf6ec/6b4c3b?text=${encodeURIComponent(pet?.name || 'Pet')}`;

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!pet) return null;

  const canApply = user && user.role !== 'admin' && pet.status === 'available';

  return (
    <div className="page pet-detail-page">
      <div className="container">
        <Link to="/pets" className="back-link">← Back to pets</Link>

        <div className="pet-detail-grid">
          {/* Image */}
          <div className="pet-detail-img-col">
            <div className="pet-detail-img-wrap">
              <img
                src={pet.photoUrl || fallbackImg}
                alt={pet.name}
                className="pet-detail-img"
                onError={(e) => { e.target.src = fallbackImg; }}
              />
              <span className={`badge badge-${pet.status} pet-detail-status`}>{pet.status}</span>
            </div>

            <div className="pet-detail-quick-facts">
              <h3>Quick Facts</h3>
              <div className="facts-grid">
                <div className="fact"><span>🐾 Species</span><strong style={{textTransform:'capitalize'}}>{pet.species}</strong></div>
                <div className="fact"><span>📏 Size</span><strong style={{textTransform:'capitalize'}}>{pet.size}</strong></div>
                <div className="fact"><span>⚧ Gender</span><strong style={{textTransform:'capitalize'}}>{pet.gender}</strong></div>
                <div className="fact"><span>🎂 Age</span><strong>{pet.age} {pet.ageUnit}</strong></div>
                {pet.color && <div className="fact"><span>🎨 Color</span><strong>{pet.color}</strong></div>}
                <div className="fact"><span>💉 Vaccinated</span><strong>{pet.vaccinated ? 'Yes' : 'No'}</strong></div>
                <div className="fact"><span>✂️ Neutered</span><strong>{pet.neutered ? 'Yes' : 'No'}</strong></div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pet-detail-info-col">
            <div className="pet-detail-header">
              <h1 className="pet-detail-name">{pet.name}</h1>
              <p className="pet-detail-breed">{pet.breed || pet.species}</p>
            </div>

            {pet.description && (
              <div className="pet-detail-section">
                <h3>About {pet.name}</h3>
                <p>{pet.description}</p>
              </div>
            )}

            {pet.healthNotes && (
              <div className="pet-detail-section">
                <h3>Health Notes</h3>
                <p>{pet.healthNotes}</p>
              </div>
            )}

            {/* Apply button / status */}
            <div className="pet-detail-actions">
              {pet.status === 'adopted' && (
                <div className="adopted-notice">🎉 {pet.name} has found a home! Check out other pets.</div>
              )}
              {pet.status === 'pending' && (
                <div className="pending-notice">⏳ An application for {pet.name} is under review.</div>
              )}
              {canApply && !showForm && (
                <button className="btn btn-primary btn-lg" onClick={() => setShowForm(true)}>
                  Apply to Adopt {pet.name} 🐾
                </button>
              )}
              {!user && pet.status === 'available' && (
                <div className="login-prompt">
                  <p>Ready to give {pet.name} a home?</p>
                  <Link to="/login" className="btn btn-primary">Login to Apply</Link>
                  <Link to="/register" className="btn btn-secondary">Register</Link>
                </div>
              )}
            </div>

            {/* Adoption form */}
            {showForm && (
              <div className="adoption-form-wrap">
                <h2>Adoption Application</h2>
                <form onSubmit={handleApply} className="adoption-form">
                  <div className="form-group">
                    <label className="form-label">Why do you want to adopt {pet.name}?</label>
                    <textarea name="message" className="form-control" value={form.message} onChange={handleChange} placeholder="Tell us about yourself and why you'd be a great match…" rows={4} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Home Type</label>
                      <select name="homeType" className="form-control" value={form.homeType} onChange={handleChange}>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condo</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pet Experience</label>
                      <textarea name="experience" className="form-control" value={form.experience} onChange={handleChange} placeholder="Previous experience with pets…" rows={2} />
                    </div>
                  </div>
                  <div className="checkbox-list">
                    <label className="checkbox-row">
                      <input type="checkbox" name="hasYard" checked={form.hasYard} onChange={handleChange} />
                      <span>Do you have a yard?</span>
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" name="hasChildren" checked={form.hasChildren} onChange={handleChange} />
                      <span>Do you have children at home?</span>
                    </label>
                    <label className="checkbox-row">
                      <input type="checkbox" name="hasOtherPets" checked={form.hasOtherPets} onChange={handleChange} />
                      <span>Do you have other pets?</span>
                    </label>
                  </div>
                  {form.hasOtherPets && (
                    <div className="form-group">
                      <label className="form-label">Describe your other pets</label>
                      <textarea name="otherPetsDescription" className="form-control" value={form.otherPetsDescription} onChange={handleChange} rows={2} />
                    </div>
                  )}
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit Application'}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
